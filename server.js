var http = require("http");
var warblers = require("./warblers.js");


http.createServer(function (request, response) {
	console.log('request: ' + request.url);
	var warbler = warblers[request.method + " " + request.url];

	if(warbler){
		warbler(request, response);
	}else{
		warblers.generic(request, response);
	}

}).listen(8000);
console.log('server is running');
