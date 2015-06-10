var fs = require('fs');

function warbler(){
  var handlerGet = {},
      handlerPost = {};
  //for each request the function app is called
  var app = function (request, response){
    //call the handler for the use function
    app.handle(request, response);
  };

  app.handle = function(request, response){
    var fct = handlerGet[request.url] || handlerPost[request.url];
    if(!fct){
      fs.readFile(__dirname + request.url, function(err, data){
        if(err){
          response.end("request not find: " + request.url);
          return;
        }else{
        //get the extension
        console.log("read the file");
        var ext = request.url.split('.')[1];
        response.writeHead(200, {'Content-Type' : 'text/' + ext});
        response.write(data);
        response.end();
        return;
       }
      });
    }else{
      fct(request, response);
    }
  };

  app.get = function (path, fct){
    handlerGet[path] = fct;
  };

  app.post = function (path, fct){
    handlerPost[path] = fct;
  };

  return app;
}

module.exports = warbler;
