var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var manager = require('./lib/manager.js');

server.listen(3000);

/* --- express --- */
app.get('/', (req, res) => {
  res.sendFile('app.html', { root: path.join(__dirname, '../client') });
});

// serve files from client and lib directory
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../lib')));

// redirect to index on 404
app.use((req, res) => res.redirect('/'));


/* --- socket events --- */
io.on('connection', (socket) => {
  var broadcastToRoom = function broadcastToRoom(event, data) {
    socket.to(manager.getRoomId(socket.id)).emit(event, data);
  };

  socket.on('newGame', () => {
    // de-register them first if they're in a current game
    if (!!manager.getRoomId(socket.id)) manager.deRegisterPlayer(socket.id);

    manager.registerPlayer(socket.id, socket);
  });

  socket.on('placeNumber', (args) => {
    if (manager.placeNumber(socket.id, args)) broadcastToRoom('numberPlaced', args);
  });

  socket.on('removeNumber', (args) => {
    if (manager.removeNumber(socket.id, args)) broadcastToRoom('numberRemoved', args);
  });

  socket.on('moveNumber', (args) => {
    if (manager.moveNumber(socket.id, args)) broadcastToRoom('numberMoved', args);
  });

  socket.on('disconnect', () => {
    manager.deRegisterPlayer(socket.id);
  });
});


/* --- manager events --- */
manager.on('playerAssigned', (roomId, playerNum, socket) => {
  socket.join(roomId);
  socket.emit('assignedRoom', playerNum);
});

manager.on('playerKicked', (roomId, socket) => {
  socket.leave(roomId);
  socket.emit('kicked');
});