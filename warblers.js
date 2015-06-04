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
	fs.readFile('data.json', function (err, data){
		console.log("type of data" + typeof data.toString());
		response.write(JSON.stringify(data));
	});
	response.end();
};

warblers["POST /warbles"] = function (request, response) {
	//get the newest wrables
	var result = [];
	var timestamp = '';
	request.on('data', function(chunkTimestamp){
		timestamp += chunk.toString();
	});

	request.on('end', function(){
		for(var i =0; i < result.length; i++){
			if(listWarbles[i].timestamp.toString() !== timestamp){
				result.unshift(listWarbles[i]);
			}
		}
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
		listWarbles.push(newWarble);

		//read file
		fs.readFile('data.json', function (err, data){
			wrablersData = JSON.parse(data);
			console.log(wrablersData);
			console.log(typeof wrablersData);
			wrablersData.unshift(newWarble);
			//write the new data
			fs.writeFile('data.json', JSON.stringify(wrablersData), function (err) {
				console.log('It\'s saved!');
			});
		});
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
