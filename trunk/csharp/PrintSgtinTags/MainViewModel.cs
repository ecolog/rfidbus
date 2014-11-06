using System;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using PrintSgtinTags.Properties;
using RfidBus.Primitives.Messages;
using RfidBus.Primitives.Messages.Printers;
using RfidBus.Primitives.Messages.Printers.Elements;
using RfidBus.Primitives.Network;
using RfidBus.Serializers.Pb;
using RfidCenter.Basic;
using RfidCenter.Basic.Arguments;
using RfidCenter.Basic.Encode;
using Code128BarCodeElement = RfidBus.Primitives.Messages.Printers.Elements.BarCodes.Code128BarCodeElement;

namespace PrintSgtinTags
{
    internal class MainViewModel : ViewModelBase
    {
        private RfidBusClient _client;
        private ICommand _connectCommand;
        private ICommand _printCommand;
        private RfidPrinterRecord _selectedPrinter;
        private ObservableCollection<RfidPrinterRecord> _loadedPrinters = new ObservableCollection<RfidPrinterRecord>();
        private ulong _companyPrefix = Settings.Default.CompanyPrefix;
        private uint _productId = Settings.Default.ProductId;
        private ulong _startSerial = Settings.Default.StartSerial;
        private int _tagsCount = Settings.Default.TagsCount;
        private bool _isWriteEpcData = Settings.Default.IsWriteEpcData;

        public bool IsWriteEpcData
        {
            get
            {
                return _isWriteEpcData;
            }

            set
            {
                if (value != _isWriteEpcData)
                {
                    _isWriteEpcData = value;
                    RaisePropertyChanged("IsWriteEpcData");
                }
            }
        }

        /// <summary>
        /// Загруженные принтеры
        /// </summary>
        public ObservableCollection<RfidPrinterRecord> LoadedPrinters
        {
            get
            {
                return _loadedPrinters;
            }
            set
            {
                if (value != _loadedPrinters)
                {
                    _loadedPrinters = value;
                    RaisePropertyChanged("LoadedPrinters");
                }
            }
        }

        /// <summary>
        /// Выбранный принтер
        /// </summary>
        public RfidPrinterRecord SelectedPrinter
        {
            get
            {
                return _selectedPrinter;
            }
            set
            {
                if (value != _selectedPrinter)
                {
                    _selectedPrinter = value;
                    RaisePropertyChanged("SelectedPrinter");
                }
            }
        }

        /// <summary>
        /// Префикс компании
        /// </summary>
        public ulong CompanyPrefix
        {
            get
            {
                return _companyPrefix;
            }

            set
            {
                if (value != _companyPrefix)
                {
                    _companyPrefix = value;
                    RaisePropertyChanged("CompanyPrefix");
                }
            }
        }

        /// <summary>
        /// Идентификатор продукта
        /// </summary>
        public uint ProductId
        {
            get
            {
                return _productId;
            }
            set
            {
                if (value != _productId)
                {
                    _productId = value;
                    RaisePropertyChanged("ProductId");
                }
            }
        }

        /// <summary>
        /// Серийный номер
        /// </summary>
        public ulong StartSerial
        {
            get
            {
                return _startSerial;
            }
            set
            {
                if (value != _startSerial)
                {
                    _startSerial = value;
                    RaisePropertyChanged("StartSerial");
                }
            }
        }

        /// <summary>
        /// Количество меток для печати
        /// </summary>
        public int TagsCount
        {
            get
            {
                return _tagsCount;
            }
            set
            {
                if (value != _tagsCount)
                {
                    _tagsCount = value;
                    RaisePropertyChanged("TagsCount");
                }
            }
        }

        ~MainViewModel()
        {
            if (_client != null && _client.IsConnected)
            {
                _client.Close();
            }
        }

        /// <summary>
        /// Команда печати
        /// </summary>
        public ICommand PrintCommand
        {
            get
            {
                return _printCommand ??
                       (_printCommand = new RelayCommand(execute => Print(), predicate => IsPrintAvailable()));
            }
        }

        /// <summary>
        /// Команда подключения к шине RFID
        /// </summary>
        public ICommand ConnectCommand
        {
            get
            {
                return _connectCommand ??
                       (_connectCommand = new RelayCommand(execute => Connect(), predicate => IsConnectAvailable()));
            }
        }

        /// <summary>
        /// Предикат доступности кнопки подключения к шине RFID
        /// </summary>
        /// <returns></returns>
        private bool IsConnectAvailable()
        {
            return _client == null || !_client.IsConnected;
        }

        /// <summary>
        /// Предикат доступности кнопки печати меток
        /// </summary>
        /// <returns></returns>
        private bool IsPrintAvailable()
        {
            return _client != null &&
                   _client.IsConnected &&
                   SelectedPrinter != null &&
                   CompanyPrefix > 0 &&
                   ProductId > 0 &&
                   StartSerial > 0 &&
                   TagsCount > 0;
        }

        /// <summary>
        /// Метод выполняет соединения с шиной RFID
        /// </summary>
        private async void Connect()
        {
            try
            {
                var pbCommunication = new PbCommunicationDescription();
                var config = new ParametersValues(pbCommunication.GetClientConfiguration());
                config.SetValue(ConfigConstants.PARAMETER_HOST, Settings.Default.BusHost);
                config.SetValue(ConfigConstants.PARAMETER_PORT, Settings.Default.BusPort);

                _client = new RfidBusClient(pbCommunication, config);

                if (!_client.Authorize(Settings.Default.BusLogin, Settings.Default.BusPassword))
                    throw new BaseException(RfidErrorCode.InvalidLoginAndPassword);

                _client.ReceivedEvent += RfidBusReceivedEvent;
                var result = await _client.SendRequestAsync(new GetLoadedRfidPrinters());
                if (result.Status != ResponseStatus.Ok)
                {
                    throw new BaseException(String.Format("Ошибка авторизации. Код статуса: {0}", result.Status));
                }

                LoadedPrinters.Clear();

                if (!result.RfidPrinters.Any()) return;

                foreach (var printer in result.RfidPrinters)
                {
                    LoadedPrinters.Add(printer);
                }

                SelectedPrinter = LoadedPrinters.First();
            }

            catch (Exception ex)
            {
                MessageBox.Show(String.Format("Не удалось установить соединение с шиной RFID. {0}", ex.Message));
            }
        }

        private static void RfidBusReceivedEvent(object sender, ReceivedEventEventArgs args)
        {
            var message = args.EventMessage as RfidPrintTaskStateChanged;
            if (message == null) return;
            switch (message.State)
            {
                case PrintOperationState.Canceled:

                    MessageBox.Show(String.Format("Печать метки была отменена."));
                    break;

                case PrintOperationState.Failed:

                    MessageBox.Show(String.Format("Не удалось произвести печать метки. {0}", message.FailReason));
                    break;
            }
        }

        /// <summary>
        /// Метод выполняет печать информации на метке
        /// </summary>
        private async void Print()
        {
            if (_client == null || !_client.IsConnected)
            {
                MessageBox.Show("Нет установленного соединения с шиной RFID");
                return;
            }
            try
            {
                //кодировщик
                var encoder = new EpcSgtin96Encoder(CompanyPrefix, ProductId, StartSerial);

                //баркод
                var barcode = new Code128BarCodeElement(5, 35, 45, 5, codeFontSize: 14)
                {
                    Value = CompanyPrefix.ToString(CultureInfo.InvariantCulture) + ProductId
                };

                for (var i = 0; i < TagsCount; i++)
                {
                    var label = new RfidPrintLabel { Width = 50, Height = 50 };

                    //текстовый элемент epc
                    var epcElement = new TextElement(5, 20, 45, 25, "Arial", 35, BaseTools.GetStringFromBinary(encoder.Epc));

                    label.Elements.Add(epcElement);
                    label.Elements.Add(barcode);  

                    if (IsWriteEpcData)
                    {
                        //элемент записи rfid данных
                        var writeEpcElement = new WriteDataLabelElement(encoder.Epc, retries: 1);
                        label.Elements.Add(writeEpcElement);
                    }         

                    var printResult =
                        await _client.SendRequestAsync(new EnqueuePrintLabelTask(SelectedPrinter.Id, label));

                    if (printResult.Status != ResponseStatus.Ok)
                    {
                        MessageBox.Show(String.Format("Не удалось добавить задачу в очередь на печать. Код статуса: {0}", printResult.Status));
                    }

                    encoder++;
                }
            }

            catch (Exception ex)
            {
                MessageBox.Show(String.Format("Не удалось добавить задачу на печать. Описание: {0}", ex.Message));
            }
        }
    }
}
