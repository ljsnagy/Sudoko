import Zepto from 'zepto';
import io from 'socket.io-client';
import GameGrid from './gameGrid.js';
import InputController from './inputController.js';
import swal from 'sweetalert2';

// connect to game server
var socket = io();

Zepto(function DOMLoaded() {
  // get divs to hold our game components
  var controllerContainer = document.getElementById('game-controller');
  var gridContainer = document.getElementById('game-grid');

  // instantiate game components
  var game = new GameGrid(gridContainer, new InputController(controllerContainer));

  var controller = new InputController(controllerContainer);

  var findNewGame = function findNewGame() {
    controller.select(['Find Game'], () => {
      // ask the server to assign us an available room
      socket.emit('newGame');

      controller.clear('Searching for another player...');
    });
  };

  // prompt user to join a new game
  findNewGame();

  // when we find another player
  socket.on('assignedRoom', (playerNum) => {
    swal({
      title: 'Game Found!',
      text: `You are player ${playerNum}.`,
    }).catch(e => {});

    // start the game
    game.newGame(playerNum, socket, (player) => {
      // give an alert when the game is over
      var title = (player === playerNum) ? 'You Have Won!' : 'You Have Lost';
      swal({
        title,
        text: 'Press "Find Game" if you wish to play again.',
      }).then(findNewGame, findNewGame);
    });
  });

  // when disconnected from the room (other player disconnects)
  socket.on('kicked', () => {
    // don't warn if the game is complete
    if (game.isOver) return;

    swal({
      title: 'Player Disconnect',
      text: 'Unfortunately the other player has left. Press "Find Game" to start a new game.',
      type: 'warning',
    }).then(findNewGame, findNewGame);

    // stop the user from performing any further game actions
    game.disable();
  })
});