var application = require('./warbler.js')(),
    databaseConfig = require('./config.js'),
    db = require('level')(databaseConfig.database, {'valueEncoding': 'json'}),
    fs = require('fs');

application.get("/", function (req, res) {
  var data = application.loadFile(__dirname + '/index.html');
  res.write(data);
  res.end();
});

application.post('/warble', function (req, res){
  var warbleString = '';
  req.on('data', function(chunk){
    warbleString += chunk;
  });

  req.on('end', function(){
    var warble;

    warbleString = warbleString.replace(/</g, "&lt").replace(/>/g, "&gt");
    console.log(warbleString);
    try{
      warble = JSON.parse(warbleString);
    }catch(err){
      console.log("fail to parse");
      res.end("wrong type of data! You must send some JSON!");
      return -1;
    }
    console.log(warble);
    //if warble valid?
    // if(validateQuery(warble, databaseConfig.validator)){
    if(true){
      db.put(warble.timestamp, warble, function(err){
        if(err){
        }else{
          res.end(warbleString);
          return -1;
        }
      });
    }else{
      console.log("nothing to put in the datatbase");
      res.end('Les donnees ne sont pas conformes!');
    }
  });
});

application.post('/delete', function (req, res){
    var stamp = "";
    req.on('data', function(data){
        stamp += data;
    });
    req.on('end', function(){
        db.del(stamp, function (err) {
          if (err) {
            console.log("error", err);
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

//helper functions
function validateQuery(query, validator){
    var result = true;
    for(var prop in validator){
      if(validator[prop].required){
        if(!query.hasOwnProperty(prop)){
          result = false;
        }
      }else{
        if(typeof query[prop] !== validator[prop].type){
          result = false;
        }
      }
    }
    return result;
  }

module.exports = application;
