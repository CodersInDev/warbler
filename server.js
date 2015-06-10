var application = require('./application.js'),
    server = require('http').createServer(application),
    io = require('socket.io')(server);

server.listen(process.env.PORT || 8000, function(){
	console.log("The Warbler server is now running!");
});

io.on('connection', function(socket){
  socket.on('warble', function(msg){
    io.emit('warble', msg);
  });
});

// var handler = require("./handler.js");
// var app = require('http').createServer(handler);
// var io = require('socket.io')(app);
//
//
// app.listen(process.env.PORT || 8000, function(){
// 	console.log('server is running');
// });
//
// io.on('connection', function(socket){
//   socket.on('warble', function(msg){
//     io.emit('warble', msg);
//   });
// });
