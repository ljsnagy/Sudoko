var should = require('should');
var {AntiSudoku} = require('../src/lib/anti-sudoku.js');

describe('Anti Sudoku', () => {
  var game;

  beforeEach(() => {
    game = new AntiSudoku();
  });

  it('should allow me to place a legal number in every cell', () => {
    var val = 1;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (val > 9) val = 1;
        game.placeNumber(val, row, col);
        game.grid[row][col].should.match({value: val});
        val++;
      }
      val = ((3 * ((row + 1) % 3)) + 1) + Math.floor((row + 1) / 3);
    }
  });

  it('should only allow me to place 1 to 9', () => {
    game.placeNumber(0, 0, 0);
    game.grid[0][0].should.be.empty();
    game.placeNumber(10, 0, 0);
    game.grid[0][0].should.be.empty();
  });

  it('should only allow me to place a number if the cell is not empty', () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        game.placeNumber(1, row, col);
        game.placeNumber(2, row, col);
        game.grid[row][col].should.match({value: 1});
        game = new AntiSudoku();
      }
    }
  });

  it('should not allow me to place the same number in a row', () => {
    var val = 1;
    for (let row = 0; row < 9; row++) {
      game.placeNumber(val, row, 0);
      for (let col = 1; col < 9; col++) {
        game.placeNumber(val, row, col);
        game.grid[row][col].should.be.empty();
      }
      game = new AntiSudoku();
    }
  });

  it('should not allow me to place the same number in a column', () => {
    var val = 1;
    for (let col = 0; col < 9; col++) {
      game.placeNumber(val, 0, col);
      for (let row = 1; row < 9; row++) {
        game.placeNumber(val, row, col);
        game.grid[row][col].should.be.empty();
      }
      game = new AntiSudoku();
    }
  });

  it('should not allow me to place the same number in a nonet', () => {
    var val = 1;
    for (let row = 0; row < 9; row += 3) {
      for (let col = 0; col < 9; col += 3) {
        game.placeNumber(val, row, col);
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (i + j !== 0) {
              game.placeNumber(val, row + i, col + j);
              game.grid[row + i][col + j].should.be.empty();
            }
          }
        }
        game = new AntiSudoku();
      }
    }
  });
});