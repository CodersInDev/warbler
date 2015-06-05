var listWarbles = [];
var warblers = {};
var fs = require('fs');

warblers["GET /"] = function (request, response) {
	fs.readFile(__dirname + "/index.html", function (err, data){
		response.write(data.toString());
		response.end();
	});
};

warblers["GET /warbles"] = function (request, response) {
	var dataFromFile = require(__dirname + '/data.json');
	response.write(JSON.stringify(dataFromFile));
	response.end();
};

warblers["POST /warbles"] = function (request, response) {
	//get the newest wrables
	var result = [];
	var timestamp = '';
	request.on('data', function(chunkTimestamp){
		timestamp += chunkTimestamp.toString();
		fs.readFile('data.json', function (err, data){
			for(var i =0; i < data.length; i++){
				if(data[i].timestamp.toString() !== timestamp){
					result.unshift(data[i]);
					break;
				}
		  }
	});
		response.write(JSON.stringify(result));
		response.end();
	});
};

warblers["POST /create"] = function (request, response) {
	//create a warbles and save it in a file
	var warbleString = '';
	var wrablersData;
	var newWarble;
	request.on('data', function(chunk){
		warbleString += chunk.toString();
	});

	request.on('end', function(){
		newWarble = JSON.parse(warbleString);
		var dataFromFile = require(__dirname + '/data.json');
		dataFromFile.unshift(newWarble);
		fs.writeFile('data.json', JSON.stringify(dataFromFile), function (err) {
			console.log('It\'s saved!');

		});
		response.end('string');
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
