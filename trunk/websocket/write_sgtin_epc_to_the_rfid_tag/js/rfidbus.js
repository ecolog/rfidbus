var requestSender;

$(document).ready(function() {

	var responseHandler = new RfidBusResponseHandler();

	responseHandler.AddHandler("AuthorizeResponse", function() {
		requestSender.SendGetReaders();
	});

	responseHandler.AddHandler("GetTranspondersResponse", function(msg) {
		msg.Transponders.forEach(function (tag) {
			var option = {
				value: tag.IdAsString,
				Type: tag.Type
			};

			tag.Extended.Groups.forEach(function(group) {
				if ("Epc" == group.Name) {
					group.Items.forEach(function(item) {
						option["Epc:" + item.Name] = item.Value;
					});
				}
			});

			option.disabled = (EpcBinaryHeader.Sgtin96 != option["Epc:Type"]); // disable not SGTIN-96 tags

			$("#tags").append( $('<option />')
				.text(option.value)
				.attr(option)
			);
		});
	});

	responseHandler.AddHandler("GetReadersResponse", function(msg) {
		msg.Readers.forEach(function (eachName) {
			requestSender.SendEnableDecodeEpc(eachName.Id);
			$("#readers").append('<option value="' + eachName.Id + '">' + eachName.Name + '</option>');
		});
	});


	var webSocketClient = new WebSocketClient(responseHandler);
	requestSender = new RfidBusRequestSender(webSocketClient, responseHandler);

	webSocketClient.AddEventHandler(WebSocketClient.EVENT_ON_OPEN, function() {
		requestSender.SendAuthorize("admin", "admin");
	});

	webSocketClient.Open("ws://demo.rfidbus.rfidcenter.ru:80");


	/*
	 * Form Events
	 */
	$("#btn_search").click(function() {
		$("#tags").empty().append( $("<option />").text('Select tag') );

		var readerId = $("#readers").val();
		requestSender.SendGetTransponders(readerId);
	});


	$("#tags").change(function() {
		$("#filter").val( $("#tags option:selected").attr("Epc:Filter") );
		$("#gcp").val( $("#tags option:selected").attr("Epc:Gcp") );
		$("#item").val( $("#tags option:selected").attr("Epc:Item") );
		$("#serial").val( $("#tags option:selected").attr("Epc:Serial") );
	});

	$("#btn_write").click(function() {
		requestSender.SendWriteEpcSgtin96(
			$("#readers").val(),
			$("#tags option:selected").attr("Antenna"),
			$("#tags option:selected").attr("Type"),
			$("#tags option:selected").val(),
			3, // See: Table 14-2 SGTIN Partition Table
			$("#filter").val(),
			$("#gcp").val(),
			$("#item").val(),
			$("#serial").val()
			);
	});

});


