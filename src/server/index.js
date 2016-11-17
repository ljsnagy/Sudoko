var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var manager = require('./lib/manager.js');

server.listen(3000);

io.on('connection', (socket) => {
  manager.registerPlayer(socket.id, socket);
});