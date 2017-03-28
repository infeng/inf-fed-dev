'use strict';

var bodyParser = require('body-parser');
var request = require('request');

const API_SERVER = process.env.API_SERVER ? process.env.API_SERVER : 'localhost:3001';
const API_PATH = process.env.API_PATH ? process.env.API_PATH : '/api';
const HTTPS = process.env.HTTPS ? process.env.HTTPS === 'true' ? true : false : false;
const TIMEOUT = 15000;
var express   = require('express'),
    proxy = require('express-http-proxy'),
    path = require('path'),
    app = express();

function getClientIp(req) {
var headers = req.headers;
var ip = headers['x-real-ip'] || headers['x-forwarded-for'] || req.connection.remoteAddress;
return ip;
}

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use('*', (req, res, next) => {
  req.body = JSON.stringify(req.body);
  let clientIp = getClientIp(req);
  req.headers['client_ip'] = clientIp;
  next();
});
app.use('/api', proxy(API_SERVER, {
   timeout: TIMEOUT,
   https: HTTPS,
   forwardPath: function(req, res) {
     return API_PATH + require('url').parse(req.url).path;
   }
}));
app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use((err, req, res, next) => {
  let date = new Date();
  var meta = '[' + date.toISOString() +']' + req.url + '\n';
  console.log(meta + err.stack + '\n');
  next();
});

var server = app.listen(process.env.PORT||8000, '0.0.0.0', function () {
  console.log('app listening on port ', process.env.PORT||8000);
});


server.timeout = TIMEOUT;
