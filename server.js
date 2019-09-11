
var express = require('express');
// var path = require('path');
var bodyParser = require('body-parser');
// var cookieParser=require('cookie-parser');
var serveStatic = require('serve-static');
require('dotenv').load();
var routes = require('./routes.js');
app = express();
app.use(serveStatic(__dirname + "/dist"));
// app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
routes(app);
var port = process.env.PORT || 50001;
app.listen(port);
console.log('server started '+ port);