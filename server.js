//Lets require/import the HTTP module
var http = require('http');
var express = require('express');
var app = express();


//database 
var db = require('./app/dbConn.js');

app.get('/', function(req, res) {
  res.sendFile('index.html', { root: __dirname + "/client" } );
});

app.get('/api/:name',function(req,res){
  var collection = db.get(req.params.name);
  collection.find({},{sort: { date: -1} },function(e,docs){
    res.json(docs);
  })
});

app.get('/api/:name/:id',function(req,res){
  var recordId = parseInt(req.params.id);
  console.log(recordId);
  var collection = db.get(req.params.name);
  collection.findById(recordId ,function(e,docs){
    res.json(docs);
  })
});

app.use(express.static('client'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});