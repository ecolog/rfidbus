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

RfidBusRequestSender.prototype.SendGetTransponders = function(readerId)
{
	this._SendingRequest({
		Name: "GetTransponders",
		ReaderId: readerId
	});
};

RfidBusRequestSender.prototype.SendWriteMultipleBlocks = function(readerId,
																  antennaId,
																  transponderType,
																  transponderId,
																  transponderBank,
																  transponderBankAddress,
																  transponderData,
																  transponderAccessPassword)
{
	this._SendingRequest({
		Name: "WriteMultipleBlocks",
		ReaderId: readerId,
		Transponder: {
			Antenna: antennaId,
			Type: transponderType,
			Id: parseHexStrToBase64(transponderId),
			BlockSize: RfidTransponder.GetTransponderBlockSize(transponderType)
		},
		TransponderBank: transponderBank,
		BankAddress: transponderBankAddress,
		Data: parseHexStrToBase64(transponderData),
		AccessPassword: transponderAccessPassword
	});

}

