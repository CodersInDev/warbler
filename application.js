var application = require('./warbler.js')(),
    databaseConfig = require('./config.js'),
    db = require('level')(databaseConfig.database, {'valueEncoding': 'json'}),
    fs = require('fs');

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
    var warble;
    if(warbleString.indexOf("<") > -1) {
      warbleString = warbleString.replace("<", "&lt");
    }
    if(warbleString.indexOf(">") > -1) {
      warbleString = warbleString.replace(">", "&gt");
    }
    try{
      warble = JSON.parse(warbleString);
    }catch(err){
      console.log(err);
      res.end("wrong type of data! You must send some JSON!");
      return;
    }
    //if warble valid?
    if(validate(warble, databaseConfig.validator)){
      db.put(warble.timestamp, warble, function(err){
        if(err){
          console.log('Impossible to store the warble into the database');
        }else{
          res.end(warbleString);
        }
      });
    }else{
      res.end("The data received are not valid");
    }
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

//Helpers
function validate(query, validator){
  var result = true;
  //check that the values required exist in query
  for(var prop in validator){
    if(validator[prop].required){
      if(!query.hasOwnProperty(prop)){
        result = false;
      }
    }else{
      //check the type of the property
      if(typeof query[prop] !== validator[prop].type){
        result = false;
      }
    }
  }
  return result;
}



module.exports = application;
