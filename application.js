var warbler = require('./warbler.js'),
    application = warbler(),
    databaseConfig = require('./config.js'),
    db = require('level')(config.database),
    fs = require('fs');

application.get("/home", function (req, res) {
    //need to write the code 202, everything is ok
    console.log(res.statusCode);
    res.write("<h1>Hello world!</h1>");
    res.write("<h1>How are you?</h1>");
    res.end();
});

application.get("/", function (req, res) {
  fs.readFile(__dirname + '/index.html', function(err, data){
    if(err){
      res.end("Could not read the index file");
      return;
    }else{
      res.write(data);
      res.end();
   }
  });
});

application.post('/warble', function (req, res){
  //need to parse the warble to delete <
  var warbleString = '';
  request.on('data', function(chunk){
    warbleString += chunk;
  });

  request.on('end', function(){
    var warble = JSON.parse(warbleString);
    db.put(warble.timestamp, warble, function(err){
      if(err){
        console.log('Impossible to store the warble into the database');
      }else{
        res.end("Wrable created!");
      }
    });
  });
});
// application.get('/warbles', function (req, res)){
//   //read from the database
//   res.write("database");
// }



module.exports = application;
