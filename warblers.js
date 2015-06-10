var listWarbles = [];
var warblers = {};
var fs = require('fs');
// var redis = require('redis');
// var client = redis.createClient();

var db = require("level")("./warbleDB");

warblers["GET /"] = function (request, response) {
	fs.readFile(__dirname + "/index.html", function (err, data){
	  response.write(data.toString());
	  response.end();
  });
};

warblers["GET /warbles"] = function (request, response) {
	// client.zrange('warbles', 0, -1, function(err, res){
		  // var resultat = res.reverse();
		  var arr = [];
		db.createValueStream()
  		.on('data', function (data) {
		    arr.push(data);
		})
		.on("end", function(){
		// response.write(arr.toString());
			response.write(JSON.stringify(arr));
			response.end();			
		});
};

warblers["POST /create"] = function (request, response) {
	//create a warbles and save it in a file
	var warbleString = '';
	request.on('data', function(chunk){
		warbleString += chunk;
	});

	request.on('end', function(){
		var obj = JSON.parse(warbleString);
			db.put(obj.timestamp , warbleString ,function(err){
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
