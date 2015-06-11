var warblers = require("./warblers.js");

function handler(request, response) {
	console.log('request: ' + request.url);
	var warbler = warblers[request.method + " " + request.url];
	if(warbler){
		warbler(request, response);
	}else{
		warblers.generic(request, response);
	}
}
module.exports = handler;
