// Test at: http://localhost:8080/pointrel/pointrel-app/
/*jslint node: true */
"use strict";

// Standard nodejs modules

var fs = require('fs');
var http = require('http');
var https = require('https');

// The modules below require npm installation

var express = require('express');
var bodyParser = require('body-parser');

// the server library
var pointrel20141201Server = require("./pointrel20141201Server");

// Main code

console.log("TanksServer server for nodejs started: " + Date());

console.log("__dirname", __dirname);

var app = express();

var logger = function(request, response, next) {
    console.log("Request:", request.method, request.url);
    next();
};

app.use(logger);

// TODO: May need to move this and split up JSON parsing functionality
// TODO: Could there be an issue with bodyParser with undeleted temp files?
// includes support to parse JSON-encoded bodies (and saving the rawBody)
pointrel20141201Server.initialize(app);
// app.use(bodyParser.json());

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); 


app.use("/", express.static(__dirname + "/../WebContent"));

// TODO: For developer testing only; remove in final version
app.use("/dojo-debug", express.static(__dirname + "/../../PNIWorkbookLibraries/dojo-release-1.10.0-src"));

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//Create an HTTP service.
var server = http.createServer(app).listen(8090, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("TanksServer app listening at http://%s:%s", host, port);
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('rotateTank', function(message) {
        io.emit('rotateTank', message);
        // console.log('rotateTank', message);
    });
    socket.on('moveTank', function(message) {
        io.emit('moveTank', message);
        // console.log('moveTank', message);
    });
    socket.on('rotateTurret', function(message) {
        io.emit('rotateTurret', message);
        // console.log('rotateTurret', message);
    });
    socket.on('fire', function(message) {
        io.emit('fire', message);
        // console.log('fire', message);
    });
    socket.on('tank', function(message) {
        io.emit('tank', message);
        // console.log('tank', message);
    });
});