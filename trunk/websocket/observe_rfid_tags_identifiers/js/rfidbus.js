var responseHandler = new RfidBusResponseHandler();

responseHandler.AddHandler("AuthorizeResponse", function() {
	requestSender.SendGetReaders();
});

responseHandler.AddHandler("GetReadersResponse", function(msg) {
	msg.Readers.forEach(function (eachName) {
		setTimeout(requestSender.SendSubscribeToReader(eachName.Id), 1000);

		setTimeout(requestSender.SendStartReading(eachName.Id), 3000);
	});
});

var webSocketClient = new WebSocketClient(responseHandler);
var requestSender = new RfidBusRequestSender(webSocketClient, responseHandler);

webSocketClient.AddEventHandler(WebSocketClient.EVENT_ON_OPEN, function() {
	requestSender.SendAuthorize("admin", "admin")
});

webSocketClient.Open("ws://172.22.1.156:8080");






