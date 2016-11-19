var EventEmitter = require('events');
var {AntiSudoku} = require('../../lib/anti-sudoku.js');

/**
 * Sorts players into rooms and manages each game.
 * @extends EventEmitter
 */
class Manager extends EventEmitter {
  constructor() {
    super();
    this._gameRooms = new Map();
    this._players = new Map();
    this._waitingPlayers = new Set();
  }

  /**
   * Returns the game for the current room player is in.
   * @param {string} playerId
   * @returns {AntiSudoku} - Game instance.
   * @private
   */
  _getGameRoom(playerId) {
    return this._gameRooms.get(this.getRoomId(playerId));
  }

  /**
   * Determines if player is able to make a move (in an active game and it's their turn).
   * @param {string} playerId
   * @returns {boolean}
   * @private
   */
  _validatePlayer(playerId) {
    var player = this._players.get(playerId);
    var game = this._gameRooms.get(player.roomId);

    // check if player is in active game
    if (!game) return false;

    // check if the player should be making the move
    return game.getPlayer() === player.number;
  }

  /**
   * Returns the room player is currently in.
   * @param {string} playerId
   * @returns {*} - Room ID or false if not in one.
   */
  getRoomId(playerId) {
    var player = this._players.get(playerId);
    if (!player) return false;
    return player.roomId || false;
  }

  /**
   * Registers a player with the manager to eventually be sorted into a room.
   * @param {String} playerId - Unique ID for the player.
   * @param {Object} data - Any arbitrary data associated with the player.
   */
  registerPlayer(playerId, data) {
    this._players.set(playerId, {data, roomId: null});
    this._waitingPlayers.add(playerId);

    // if we've got 2 players waiting time to match them into a room
    if (this._waitingPlayers.size === 2) {
      // create a room ID
      var roomId = String(Date.now());

      // create a room with a new game instance
      this._gameRooms.set(roomId, new AntiSudoku());

      // keep track of the player number
      var currPlayer = 1;

      // assign our players into their room
      this._waitingPlayers.forEach((playerId) => {
        var player = this._players.get(playerId);
        player.roomId = roomId;
        player.number = currPlayer++;
        this.emit('playerAssigned', roomId, player.data);
      });
      this._waitingPlayers.clear();
    }
  }

  /**
   * Places a number for the given player.
   * @param {string} playerId - ID of the player making the move.
   * @param {{num: (number), row: (number), col: (number)}} args - Arguments to placeNumber method.
   * @returns {boolean} - Whether the move was successful.
   */
  placeNumber(playerId, {num, row, col} = {}) {
    if (!this._validatePlayer(playerId)) return false;
    var game = this._getGameRoom(playerId);
    return game.placeNumber(num, row, col);
  }

  /**
   * Removes a number for the given player.
   * @param {string} playerId - ID of the player making the move.
   * @param {{row: (number), col: (number)}} args - Arguments to removeNumber method.
   * @returns {boolean} - Whether the move was successful.
   */
  removeNumber(playerId, {row, col} = {}) {
    if (!this._validatePlayer(playerId)) return false;
    var game = this._getGameRoom(playerId);
    return game.removeNumber(row, col);
  }

  /**
   * Moves a number for the given player.
   * @param {string} playerId - ID of the player making the move.
   * @param {{srcRow: (number), srcCol: (number), dstRow: (number), dstCol: (number)}} args - Arguments to moveNumber method.
   * @returns {boolean} - Whether the move was successful.
   */
  moveNumber(playerId, {srcRow, srcCol, dstRow, dstCol} = {}) {
    if (!this._validatePlayer(playerId)) return false;
    var game = this._getGameRoom(playerId);
    return game.moveNumber(srcRow, srcCol, dstRow, dstCol);
  }
}

module.exports = new Manager();