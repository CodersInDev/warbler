var listWarbles = [];
var warblers = {};
var fs = require('fs');
var redis = require('redis');
// var client = redis.createClient();

var url = require('url');
var redisURL = url.parse(process.env.REDIS_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

// warblers["GET /"] = function (request, response) {
//   response.end("hello");
// };

warblers["GET /"] = function (request, response) {
	fs.readFile(__dirname + "/index.html", function (err, data){
	  response.write(data.toString());
	  response.end();
  });
};

warblers["GET /warbles"] = function (request, response) {
	client.zrange('warbles', 0, -1, function(err, res){
		  var resultat = res.reverse();
		  response.write('[' + res.toString() + ']');
			response.end();
	});
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
		var obj = JSON.parse(warbleString);
			client.zadd('warbles', obj.timestamp , warbleString ,function(err, res){
				if(err){console.log(err);}
				console.log("key saved");
			});
	    response.end('new wrable saved');

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
