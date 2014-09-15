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
	var msg = new Object();
	msg.Name = "Authorize";
	msg.Login = login;
	msg.Password = password;
	msg.Token = token;

	this._SendingRequest(msg);
};

RfidBusRequestSender.prototype.SendGetReaders = function()
{
	var msg = new Object();
	msg.Name = "GetReaders";

	this._SendingRequest(msg);
};

RfidBusRequestSender.prototype.SendSubscribeToReader = function(readerId)
{
	var msg = new Object();
	msg.Name = "SubscribeToReader";
	msg.ReaderId = readerId;

	this._SendingRequest(msg);
};

RfidBusRequestSender.prototype.SendStartReading = function(readerId)
{
	var msg = new Object();
	msg.Name = "StartReading";
	msg.ReaderId = readerId;

	this._SendingRequest(msg);
};

RfidBusRequestSender.prototype.SendEnableDecodeEpc = function(readerId)
{
	var msg = new Object();
	msg.Name = "EnableDecodeEpc";
	msg.ReaderId = readerId;

	this._SendingRequest(msg);
};
