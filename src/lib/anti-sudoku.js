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
   * @returns {boolean} Indicates if the move was legal.
   */
  placeNumber(num, row, col) {
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
    this.nextPlayer();

    return true;
  }

  /**
   * Validates and removes a number from the grid.
   * @param {number} row - Row to remove (0 - 8).
   * @param {number} col - Column to remove (0 - 8).
   * @returns {boolean} Indicates if the move was legal.
   */
  removeNumber(row, col) {
    // cannot remove empty cell
    if (!this.grid[row][col].value) return false;

    // cannot remove number player doesn't own
    if (this.grid[row][col].player !== this.currentPlayer) return false;

    // record the removed number
    this.removedNumbers[row][col] = this.grid[row][col].value;

    // remove the entry
    this.grid[row][col] = {};

    // move is finished
    this.nextPlayer();

    return true;
  }
}