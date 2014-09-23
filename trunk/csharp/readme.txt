I. Предстваленные примеры

* ComAsClassExample - пример использования COM/Active-X объекта для работы с Шиной RFID в качестве обычного класса .NET.
* RfidBusClientExample - пример использования класса RfidBusClient для работы с Шиной RFID.

II. Зависимости

1. ComAsClassExample

Проект ComAsClassExample зависит от сборок RfidBus.Com.Primitives.dll и RfidBus.Com.dll, которые можно найти по месту установки Шины RFID (обычно: «c:\Program Files (x86)\RfidCenter\RfidBus\»).

2. RfidBusClientExample

Проект RfidBusClientExample зависит от сборок RfidCenter.Basic.dll, RfidCenter.Devices.dll, RfidBus.Primitives.dll, расположенных по месту установки Шины RFID, и RfidBus.Serializers.Pb.dll, расположенной в поддиректории «serializers» в корневой директории Шины RFID.