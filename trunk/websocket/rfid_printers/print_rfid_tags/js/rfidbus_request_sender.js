function RfidBusRequestSender(webSocketClient)
{
	this._webSocketClient = webSocketClient;
};

RfidBusRequestSender.prototype._SendingRequest = function(request)
{
	this._webSocketClient.SendRequest(request);
};

RfidBusRequestSender.prototype.SendAuthorize = function(login, password, token)
{
	var msg = {
		Name: "Authorize",
		Login: login,
		Password: password,
		Token: token
	};

	this._SendingRequest(msg);
};

RfidBusRequestSender.prototype.SendGetLoadedRfidPrinters = function()
{
	var msg = {
		Name: "GetLoadedRfidPrinters"
	};

	this._SendingRequest(msg);
};

RfidBusRequestSender.prototype.SendEnqueuePrintLabelTask = function(printerId, printLabel)
{
	var msg = {
		Name: "EnqueuePrintLabelTask",
		PrinterId: printerId,
        PrintLabel: printLabel,
	};

	this._SendingRequest(msg);
};

