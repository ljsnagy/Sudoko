/**
 * Returns an empty 2D array to represent the game grid.
 * @param {*} placeholder - initial value
 * @returns {Array}
 */
var constructGrid = function constructGrid(placeholder) {
  var grid = [];
  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
      grid[i][j] = placeholder;
    }
  }
  return grid;
};

/**
 * Checks if the provided row and column are within the boundaries.
 * @param {number} row
 * @param {number} col
 * @returns {boolean}
 */
var validateGrid = function validateGrid(row, col) {
  return (row < 9 && col < 9) && (row >= 0 && col >= 0);
};

/** Represents an Anti Sudoku game. */
export class AntiSudoku {
  /**
   * Set up new game.
   * @param {function} onComplete - Called when game is won and is passed the winning player.
   */
  constructor(onComplete = () => {}) {
    this.grid = constructGrid({});
    this.removedNumbers = constructGrid(null);
    this.currentPlayer = 1;
    this.onComplete = onComplete;
  }

  /** Swaps the current player. */
  nextPlayer() {
    this.currentPlayer = (this.currentPlayer % 2) + 1;
  }

  /**
   * Checks if the game is won and calls the callback if so.
   * @param {number} row - Row regarding the previous move.
   * @param {number} col - Column regarding previous move.
   */
  checkWin(row, col) {
    // optimistic vars
    var hasRow = true;
    var hasColumn = true;
    var hasNonet = true;

    // check if the row or column is complete
    for (let i = 0; i < 9; i++) {
      if (!this.grid[row][i].value) hasRow = false;
      if (!this.grid[i][col].value) hasColumn = false;
    }

    // check if the nonet is complete
    var rowOffset = Math.floor(row / 3) * 3;
    var colOffset = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!this.grid[rowOffset + i][colOffset + j].value) hasNonet = false;
      }
    }

    if (hasRow || hasColumn || hasNonet) this.onComplete(this.currentPlayer);
  }

  /**
   * Returns the current player.
   * @returns {number}
   */
  getPlayer() {
    return this.currentPlayer;
  }

  /**
   * Validates and inserts a number into the grid.
   * @param {number} num - Number to insert.
   * @param {number} row - Row to insert (0 - 8).
   * @param {number} col - Column to insert (0 - 8).
   * @param {boolean} nextPlayer - Should the game swap the player afterwards?
   * @returns {boolean} Indicates if the move was legal.
   */
  placeNumber(num, row, col, nextPlayer = true) {
    // number must be between 1 and 9
    if (num < 1 || num > 9) return false;

    if (!validateGrid(row, col)) return false;

    // cannot place another number on occupied cell
    if (!!this.grid[row][col].value) return false;

    // cannot place last removed number on same cell
    if (this.removedNumbers[row][col] === num) return false;

    // check row and column for duplicate number
    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i].value === num) return false;
      if (this.grid[i][col].value === num) return false;
    }

    // check nonet for duplicate number
    var rowOffset = Math.floor(row / 3) * 3;
    var colOffset = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[rowOffset + i][colOffset + j].value === num) return false;
      }
    }

    // add to the grid
    this.grid[row][col] = {player: this.currentPlayer, value: num};

    this.checkWin(row, col);

    // move is finished
    if (nextPlayer) this.nextPlayer();

    return true;
  }

  /**
   * Validates and removes a number from the grid.
   * @param {number} row - Row to remove (0 - 8).
   * @param {number} col - Column to remove (0 - 8).
   * @param {boolean} nextPlayer - Should the game swap the player afterwards?
   * @returns {boolean} Indicates if the move was legal.
   */
  removeNumber(row, col, nextPlayer = true) {
    if (!validateGrid(row, col)) return false;

    // cannot remove empty cell
    if (!this.grid[row][col].value) return false;

    // cannot remove number player doesn't own
    if (this.grid[row][col].player !== this.currentPlayer) return false;

    // record the removed number
    this.removedNumbers[row][col] = this.grid[row][col].value;

    // remove the entry
    this.grid[row][col] = {};

    // move is finished
    if (nextPlayer) this.nextPlayer();

    return true;
  }

  /**
   * Moves a number to the same row, column or nonet.
   * @param {number} srcRow - Row to move number from.
   * @param {number} srcCol - Column to move number from.
   * @param {number} dstRow - Row to move number to.
   * @param {number} dstCol - Column to move number to.
   * @param {boolean} nextPlayer - Should the game swap the player afterwards?
   * @returns {boolean} Indicates if the move was legal.
   */
  moveNumber(srcRow, srcCol, dstRow, dstCol, nextPlayer = true) {
    // can't move to the same cell
    if (srcRow === dstRow && srcCol === dstCol) return false;

    var inRow = srcRow === dstRow;
    var inCol = srcCol === dstCol;
    var inNonet = Math.floor(srcCol / 3) === Math.floor(dstCol / 3)
      && Math.floor(srcRow / 3) === Math.floor(dstRow / 3);

    // destination must be in same row column or nonet
    if (!inRow && !inCol && !inNonet) return false;

    // store the number the player want's to move
    var cellToMove = this.grid[srcRow][srcCol];

    // attempt to remove the number from the cell
    if (!this.removeNumber(srcRow, srcCol, false)) return false;

    // attempt to place the removed number into the cell
    if (this.placeNumber(cellToMove.value, dstRow, dstCol, nextPlayer)) {
      return true;
    } else {
      // revert the move if it fails
      this.grid[srcRow][srcCol] = cellToMove;
      this.removedNumbers[srcRow][srcCol] = null;
      return false;
    }
  }
}