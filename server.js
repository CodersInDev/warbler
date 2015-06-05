var handler = require("./handler.js");
var app = require('http').createServer(handler);
var io = require('socket.io')(app);


app.listen(8000, function(){
	console.log('server is running');
});

io.on('connection', function(socket){
  socket.on('warble', function(msg){
    io.emit('warble', msg);
  });
});
