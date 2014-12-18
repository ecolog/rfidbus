function WebSocketClient(responseHandler)
{
    this._webSocket = null;
    this._responseHandler = responseHandler;

    this._eventHandlers = [];
    this._eventHandlers[WebSocketClient.EVENT_ON_OPEN]  = [];
    this._eventHandlers[WebSocketClient.EVENT_ON_CLOSE] = [];
    this._eventHandlers[WebSocketClient.EVENT_ON_ERROR] = [];
};

WebSocketClient.prototype.Open = function(uri)
{
    if (! "WebSocket" in window) {
    	console.error("WebSocket not supported by your Browser!");
    	return;
    }

    this._webSocket = new WebSocket(uri);
    
    var self = this;
	this._webSocket.onopen = function()
	{
		var handlers = self._eventHandlers[WebSocketClient.EVENT_ON_OPEN];
		for (var i in handlers) {
            handlers[i].call();
        }
	};

	this._webSocket.onmessage = function(msg)
	{
		console.debug(msg.data);

		var response = JSON.parse(msg.data);
		self._responseHandler.OnEventHandle(response.Name, response);
	};
};

WebSocketClient.prototype.SendRequest = function(request)
{
	var msg = JSON.stringify(request);
	console.debug(msg);

	this._webSocket.send(msg);
};

WebSocketClient.prototype.Close = function(uri)
{
	this._webSocket.close();
};

WebSocketClient.prototype.AddEventHandler = function (event, handler)
{
	this._eventHandlers[event].push(handler);
};

WebSocketClient.EVENT_ON_OPEN = "ON_OPEN";
WebSocketClient.EVENT_ON_CLOSE= "ON_CLOSE";
WebSocketClient.EVENT_ON_ERROR= "ON_CLOSE";