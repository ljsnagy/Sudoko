/**
 * Returns an empty 2D array to represent the game grid.
 * @param {*} placeholder - initial value
 * @returns {Array}
 */
var constructGrid = function(placeholder) {
  var grid = [];
  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
      grid[i][j] = placeholder;
    }
  }
  return grid;
};

/** Represents an Anti Sudoku game. */
export class AntiSudoku {
  /** Set up new game. */
  constructor() {
    this.grid = constructGrid({});
    this.removedNumbers = constructGrid(null);
    this.currentPlayer = 1;
  }

  /** Swaps the current player. */
  nextPlayer() {
    this.currentPlayer = (this.currentPlayer % 2) + 1;
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