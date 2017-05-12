var app = function () {
var http = require('http');
var express = require('express');
var app = express();
var path = require('path');

  app.set('views', __dirname + '/src');
  app.use(express.static(path.join(__dirname, 'src')));
  app.engine('html', require('ejs').renderFile);
  app.get('/', function(req, res) {
    res.render('index.html');
  });

  return app;
}();

module.exports = app;