var requestSender;

$(document).ready(function() {

	var responseHandler = new RfidBusResponseHandler();

	responseHandler.AddHandler("AuthorizeResponse", function() {
		requestSender.SendGetReaders();
	});

	responseHandler.AddHandler("GetTranspondersResponse", function(msg) {
		if (!msg.Transponders) {
			return;
		}
		msg.Transponders.forEach(function (tag) {
			$("#tags").append( $('<option />')
					.text(tag.IdAsString)
					.attr({
						Antenna: tag.Antenna,
						Type: tag.Type
					})
			);
		});
	});

	responseHandler.AddHandler("GetReadersResponse", function(msg) {
		msg.Readers.forEach(function (eachName) {
			$("#readers").append('<option value="' + eachName.Id + '">' + eachName.Name + '</option>');
		});
	});

	var webSocketClient = new WebSocketClient(responseHandler);
	requestSender = new RfidBusRequestSender(webSocketClient, responseHandler);

	webSocketClient.AddEventHandler(WebSocketClient.EVENT_ON_OPEN, function() {
		requestSender.SendAuthorize("demo", "demo");
	});

	webSocketClient.Open("ws://demo.rfidbus.rfidcenter.ru:80");


	/*
	 * Form Events
	 */
	$("#btn_search").click(function() {
		$("#tags").empty().append($("<option />").text('Select tag'))

		var readerId = $("#readers").val();
		requestSender.SendGetTransponders(readerId);
	});

	$("#tags").change(function() {
		$("#epc").val( $("#tags option:selected").val() );
	});

	$("#btn_write").click(function() {
		requestSender.SendWriteMultipleBlocks(
			$("#readers").val(), // reader GUID
			$("#tags option:selected").attr("Antenna"), // Reader antenna number
			$("#tags option:selected").attr("Type"), // Transponder Type
			$("#tags option:selected").val(), // Transponder Id [string]
			RfidTransponderBank.Epc, // Transponder Bank
			RfidTransponderBank.EpcDataOffset, // Data blocks address in transponder bank
			$("#epc").val(), // Data
			null // Access Password
		);
	});
});