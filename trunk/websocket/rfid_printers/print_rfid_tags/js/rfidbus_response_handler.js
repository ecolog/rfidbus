function RfidBusResponseHandler()
{
	/* Обработчики ответов по типу запроса */
	this._customHandlers = [];

};

RfidBusResponseHandler.prototype.AddHandler = function(msgType, handler)
{
	var handlers = this._customHandlers[msgType];
	if (handlers == null) {

		handlers = [];
		handlers.push(handler);
		this._customHandlers[msgType] = handlers;
		return;
	}

	handlers.push(handler);
};

RfidBusResponseHandler.prototype.OnEventHandle = function(msgType, eventArgs)
{
	var handlers = this._customHandlers[msgType];
	if (handlers != null) {

		for (var i in handlers) {
			if (!handlers.hasOwnProperty(i)) continue;
			handlers[i].call(this, eventArgs);
		}
	}
};

