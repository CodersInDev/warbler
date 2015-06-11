var application = require('./application.js'),
    server = require('http').createServer(application),
    io = require('socket.io')(server);

server.listen(process.env.PORT || 8000, function(){
	console.log("The Warbler server is now running!");
});

io.on('connection', function(socket){
  socket.on('warble', function(msg){
    io.emit('warbleFromServer', msg);
  });
});
