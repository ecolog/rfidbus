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
	this._SendingRequest({
		Name: "Authorize",
		Login: login,
		Password: password,
		Token: token
	});
};

RfidBusRequestSender.prototype.SendGetReaders = function()
{
	this._SendingRequest({
		Name: "GetReaders"
	});
};

RfidBusRequestSender.prototype.SendEnableDecodeEpc = function(readerId)
{
	this._SendingRequest({
		Name: "EnableDecodeEpc",
		ReaderId: readerId
	});
};

RfidBusRequestSender.prototype.SendDisableDecodeEpc = function(readerId)
{
	this._SendingRequest({
		Name: "DisableDecodeEpc",
		ReaderId: readerId
	});
};

RfidBusRequestSender.prototype.SendGetTransponders = function(readerId)
{
	this._SendingRequest({
		Name: "GetTransponders",
		ReaderId: readerId
	});
};

RfidBusRequestSender.prototype.SendWriteEpcSgtin96 = function(readerId,
															  antennaId,
															  transponderType,
															  transponderId,
															  table, // TODO: rename
															  epcFilter,
															  gln, // TODO: rename
															  item,
															  serial
															  )
{

	this._SendingRequest({
		Name: "WriteEpcSgtin96",
		ReaderId: readerId,
		Transponder: {
			Antenna: antennaId,
			Type: transponderType,
			Id: parseHexStrToBase64(transponderId),
			BlockSize: RfidTransponder.GetTransponderBlockSize(transponderType)
		},
		Table: table,
		EpcFilter: epcFilter,
		Gln: gln,
		Item: item,
		Serial: serial
	});
};
