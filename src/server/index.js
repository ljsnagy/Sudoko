var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var manager = require('./lib/manager.js');

server.listen(3000);

io.on('connection', (socket) => {
  var broadcastToRoom = function broadcastToRoom(event, data) {
    socket.to(manager.getRoomId(socket.id)).emit(event, data);
  };

  manager.registerPlayer(socket.id, socket);

  socket.on('placeNumber', (args) => {
    if (manager.placeNumber(socket.id, args)) broadcastToRoom('numberPlaced', args);
  });

  socket.on('removeNumber', (args) => {
    if (manager.removeNumber(socket.id, args)) broadcastToRoom('numberRemoved', args);
  });
});

manager.on('playerAssigned', (roomId, socket) => {
  socket.join(roomId);
  socket.emit('assignedRoom');
});