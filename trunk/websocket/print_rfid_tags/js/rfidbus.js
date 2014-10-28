var responseHandler = new RfidBusResponseHandler();

$(document).ready(function() {


    responseHandler.AddHandler("AuthorizeResponse", function () {

        requestSender.SendGetLoadedRfidPrinters();
    });

    responseHandler.AddHandler("GetLoadedRfidPrintersResponse", function (msg) {

        if (!msg.RfidPrinters) {
            return;
        }
        msg.RfidPrinters.forEach(function (printer) {
            $("#printers").append($('<option />')
                    .text(printer.Name)
                    .attr({
                        Id: printer.Id,
                    })
            );
        });
    });


    var webSocketClient = new WebSocketClient(responseHandler);
    var requestSender = new RfidBusRequestSender(webSocketClient, responseHandler);

    webSocketClient.AddEventHandler(WebSocketClient.EVENT_ON_OPEN, function () {
        requestSender.SendAuthorize("admin", "admin");
    });

    webSocketClient.Open("ws://demo.rfidbus.rfidcenter.ru:80");


    /*
     * Form Events
     */

    $("#btn_print").click(function() {

        tid_tpl = $("#prefix").val() + "%0" + $("#to").val().length + "d";

        for (var i = $("#from").val(); i <= $("#to").val(); i++) {
            tid = sprintf(tid_tpl, i);
            console.log($("#printers option:selected").attr("Id") + "--" + tid)

            label = {
                Width: 30,
                Height: 20,
                Orientation: 0,
                Elements: [
                    {
                        ElementType: "RfidBus.Primitives.Messages.Printers.Elements.TextElement",
                        X: 5,
                        Y: 5,
                        Width: 30,
                        Height: 20,
                        FontFamily: "Arial",
                        FontSize: 20,
                        Text: tid
                    },
                    {
                        ElementType: "RfidBus.Primitives.Messages.Printers.Elements.WriteDataLabelElement",
                        StartingBlock: 0,
                        MemoryBank: 1,
                        Data: parseHexStrToBase64(tid)
                    }
                ]
            };
            requestSender.SendEnqueuePrintLabelTask(
                $("#printers option:selected").attr("Id"),
                label
             );

        }

    });


});