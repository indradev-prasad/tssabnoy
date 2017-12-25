// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
//socket configration===========================================================
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./app/socket')(io); // pass io for handling

var port     = process.env.PORT || 8080;

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'));//public path 

// routes ======================================================================
require('./app/routes.js')(app); // load our routes and pass in our app 

// launch ======================================================================
http.listen(port);
console.log('Server started on port ' + port);
