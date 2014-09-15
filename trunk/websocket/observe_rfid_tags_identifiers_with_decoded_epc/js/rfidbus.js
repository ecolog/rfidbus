var responseHandler = new RfidBusResponseHandler();

responseHandler.AddHandler("AuthorizeResponse", function() {

	requestSender.SendGetReaders();
});

responseHandler.AddHandler("GetReadersResponse", function(msg) {
	msg.Readers.forEach(function (eachName) {
		requestSender.SendEnableDecodeEpc(eachName.Id);
		requestSender.SendSubscribeToReader(eachName.Id);
		requestSender.SendStartReading(eachName.Id);

	});
});

var webSocketClient = new WebSocketClient(responseHandler);
var requestSender = new RfidBusRequestSender(webSocketClient, responseHandler);

webSocketClient.AddEventHandler(WebSocketClient.EVENT_ON_OPEN, function() {
	requestSender.SendAuthorize("demo", "demo");
});

webSocketClient.Open("ws://demo.rfidbus.rfidcenter.ru:80");






