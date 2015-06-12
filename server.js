var application = require('./application.js'),
    server = require('http').createServer(application),
    http = require('http'),
    io = require('socket.io')(server);

function Warble(obj) {
    	this.content = obj.content;
    	this.timestamp = Date.now();
    	this.user = obj.user;
    	this.deleted = false;
      this.location = {latitude: obj.location.latitude, longitude: obj.location.longitude, city: "lost city", suburb: "lost suburb"};
}

server.listen(process.env.PORT || 8000, function(){
	console.log("The Warbler server is now running!");
});

io.on('connection', function(socket){
  socket.on('warble', function(msg){
    console.log(msg);
    var newWarble =  new Warble(msg);

    var result = '';
    var path = 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + newWarble.location.latitude + '&lon=' + newWarble.location.longitude + '&zoom=18&addressdetails=1';
    http.get(path, function(respondLocation){
      console.log("request the name of the location");
      respondLocation.on('data', function (chunk) {
        result += chunk;
      });
      respondLocation.on('end', function(){
        var address = JSON.parse(result);
        newWarble.location.city = address.address.city;
        newWarble.location.suburb =  address.address.suburb;
        io.emit('warbleFromServer', newWarble);
      });
      respondLocation.on('error', function(err){
        console.log(err);
      });
    });
  });

  socket.on("delete", function(stamp){
  	io.emit("deleteFromServer", stamp);
  });

  socket.on('error', function(err){
    console.log(err);
  });
});
