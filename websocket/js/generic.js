
function parseHexStrToBase64(hexStr) {
	byteStr = "";
	for (var i = 0; i < hexStr.length; i += 2) {
		byteStr += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
	}
	return window.btoa(byteStr);
}



// small fix for IE
if (!('forEach' in Array.prototype)) {
	Array.prototype.forEach= function(action, that /*opt*/) {
		for (var i= 0, n= this.length; i<n; i++)
			if (i in this)
				action.call(that, this[i], i, this);
	};
}