var listWarbles = [];
var warblers = {};
var fs = require('fs');
var redis = require('redis');
var client = redis.createClient();

warblers["GET /"] = function (request, response) {
	fs.readFile(__dirname + "/index.html", function (err, data){
	  response.write(data.toString());
	  response.end();
  });
};

function getWarbles(iterator){
	if(iterator !== 0){
		client.scan(0, function(err, result){
      	
		});
	}
}

warblers["GET /warbles"] = function (request, response) {
	var warbles = [];
	//scan function return [iteratorNum, [list of timestamp]]
	client.scan(0,function(err, result){
		var checkIterator = 0;
		result[1].forEach(function(timestamp){
			client.get(timestamp, function(err, warble){
				warbles.push(JSON.parse(warble));
				checkIterator++;
				if(checkIterator === result[1].length){
					response.write(JSON.stringify(warbles));
					response.end();
				}
			});
		});
	});
	// client.get("myKey",function(err, result){
	// 	if(err){
	// 		console.log(err);
	// 	}
	// 	console.log("valeur " + result);

	// });
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
		  //save the warble in redis as a timestamp:jsonStringWarble
	  	client.set(obj.timestamp.toString(), warbleString, function(err, res){
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
