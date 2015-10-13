//Lets require/import the HTTP module
var http = require('http');
var express = require('express');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('./client');
});

app.use(express.static('client'));
app.use('/data', express.static('app/data'));

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});