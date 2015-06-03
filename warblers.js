var listWarbles = [{id: 1, content: "first warble", timestamp: "2015/06/01"}, {id: 2, content: "second warble", timestamp: "2015/06/02"}];
var warblers = {};
var fs = require('fs');

warblers["GET /"] = function (request, response) {
	fs.readFile(__dirname + "/index.html", function (err, data){
		response.write(data.toString());
		response.end();
	});
};

warblers["GET /warbles"] = function (request, response) {
	response.write(JSON.stringify(listWarbles));
	response.end();
};


wrablers["POST /create"] = function (request, response) {
	request.on('data', function(chunck){
		console.log(chunk);
	});
};

warblers.generic = function (request, response){
	fs.readFile(__dirname + request.url, function (err, data){
		if (err){
			fs.readFile(__dirname + "/404.html", function (err, data){
				response.writeHead(404);
				response.write(data);
				response.end();
			});
		} else {
			var ext = request.url.split('.')[1];
      response.writeHead(200, {'Content-Type' : 'text/' + ext});
			response.write(data.toString());
			response.end();
		}
	});
};

module.exports = warblers;
