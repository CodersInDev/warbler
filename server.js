var http = require("http");
var handler = require("./handler.js");


http.createServer(handler).listen(8000);


console.log('server is running');
