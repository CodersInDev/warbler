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
    var fct;
    if(request.method === 'GET'){
      fct = handlerGet[request.url];
    }
    if(request.method === 'POST'){
      fct = handlerPost[request.url];
    }
    if(!fct){
      var data = app.loadFile(__dirname + request.url);
        if(!data){
          var errorFile = app.loadFile(__dirname + "/404.html");
          response.end(errorFile);
          console.log("Sorry couldn't not load the file " + request.url);
          return;
        }else{
          var ext = request.url.split('.')[1];
          response.writeHead(200, {'Content-Type' : 'text/' + ext});
          response.write(data);
          response.end();
          return;
        }
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

  app.loadFile = function(path){
    try{
      return fs.readFileSync(path);
    }catch(err){
      return undefined;
    }
  };

  return app;
}

module.exports = warbler;
