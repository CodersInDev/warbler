var application = require('./warbler.js')(),
    databaseConfig = require('./config.js'),
    db = require('level')(databaseConfig.database, {'valueEncoding': 'json'}),
    fs = require('fs');

application.get("/home", function (req, res) {
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
  var warbleString = '';
  req.on('data', function(chunk){
    warbleString += chunk;
  });

  req.on('end', function(){
    var warble = JSON.parse(warbleString);
    db.put(warble.timestamp, warble, function(err){
      if(err){
        console.log('Impossible to store the warble into the database');
      }else{
        res.end(warbleString);
      }
    });
  });
});

application.get('/warbles', function (req, res){
  var warbles = {warbles: []};
  db.createValueStream({"reverse" : true})
  .on('data', function (data) {
    warbles.warbles.push(data);
  })
  .on("end", function(){
    // response.write(arr.toString());
    res.write(JSON.stringify(warbles));
    res.end();
  });
});

module.exports = application;
