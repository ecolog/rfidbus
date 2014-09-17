
function parseHexStrToBase64(hexStr) {
	byteStr = "";
	for (var i = 0; i < hexStr.length; i += 2) {
		byteStr += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
	}
	return window.btoa(byteStr);
}
