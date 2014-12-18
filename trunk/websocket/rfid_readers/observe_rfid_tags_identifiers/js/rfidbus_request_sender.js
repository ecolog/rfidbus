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

RfidBusRequestSender.prototype.SendGetReaders = function()
{
	var msg = {
		Name: "GetReaders"
	};

	this._SendingRequest(msg);
};

RfidBusRequestSender.prototype.SendSubscribeToReader = function(readerId)
{
	var msg = {
		Name: "SubscribeToReader",
		ReaderId: readerId
	};

	this._SendingRequest(msg);
};

RfidBusRequestSender.prototype.SendStartReading = function(readerId)
{
	var msg = {
		Name : "StartReading",
		ReaderId : readerId
	};

	this._SendingRequest(msg);
};