var EventEmitter = require('events');
var {AntiSudoku} = require('../../lib/anti-sudoku.js');

/**
 * Sorts players into rooms and manages each game.
 * @extends EventEmitter
 */
class Manager extends EventEmitter {
  constructor() {
    super();
    this.gameRooms = new Map();
    this.players = new Map();
    this.waitingPlayers = new Set();
  }

  /**
   * Registers a player with the manager to eventually be sorted into a room.
   * @param {String} playerId - Unique ID for the player.
   * @param {Object} data - Any arbitrary data associated with the player.
   */
  registerPlayer(playerId, data) {
    this.players.set(playerId, {data, roomId: null});
    this.waitingPlayers.add(playerId);

    // if we've got 2 players waiting time to match them into a room
    if (this.waitingPlayers.size === 2) {
      // create a room ID
      var roomId = String(Date.now());

      // create a room with a new game instance
      this.gameRooms.set(roomId, new AntiSudoku());

      // assign our players into their room
      this.waitingPlayers.forEach((playerId) => {
        var player = this.players.get(playerId);
        player.roomId = roomId;
        this.emit('playerAssigned', roomId, player);
      });
      this.waitingPlayers.clear();
    }
  }
}

module.exports = new Manager();