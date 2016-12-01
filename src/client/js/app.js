import Zepto from 'zepto';
import io from 'socket.io-client';
import GameGrid from './gameGrid.js';
import InputController from './inputController.js';

// connect to game server
var socket = io();

Zepto(function DOMLoaded() {
  // get divs to hold our game components
  var controllerContainer = document.getElementById('game-controller');
  var gridContainer = document.getElementById('game-grid');

  // instantiate game components
  var controller = new InputController(controllerContainer);
  var game = new GameGrid(gridContainer, controller);

  // ask the server to assign us an available room
  socket.emit('newGame');

  socket.on('assignedRoom', (playerNum) => {
    // we've found another player - start the game
    game.newGame(playerNum, socket);
  });
});