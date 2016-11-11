/**
 * Returns an empty 2D array to represent the game grid.
 * @returns {Array}
 */
var constructGrid = function() {
  var grid = [];
  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
      grid[i][j] = {};
    }
  }
  return grid;
};

export class AntiSudoku {
  constructor() {
    this.grid = constructGrid();
    this.currentPlayer = 1;
  }

  placeNumber(num, row, col) {
    if (num < 1 || num > 9) return false;

    if (!!this.grid[row][col].value) return false;

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

    this.grid[row][col] = {player: this.currentPlayer, value: num};

    this.currentPlayer = (this.currentPlayer % 2) + 1;

    return true;
  }
}