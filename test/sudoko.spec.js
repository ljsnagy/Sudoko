var should = require('should');
var { default: Sudoko } = require('../src/lib/sudoko.js');

should.Assertion.addChain('return');

describe('Anti Sudoku', () => {
  var game;

  beforeEach(() => game = new Sudoko());

  it('should return the current player', () => {
    game.getPlayer().should.return.exactly(1);
    game.placeNumber(1, 0, 0);
    game.getPlayer().should.return.exactly(2);
  });

  it('should allow me to place a legal number in every cell', () => {
    var val = 1;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (val > 9) val = 1;
        game.placeNumber(val, row, col).should.return.true();
        game.getCell(row, col).should.match({value: val});
        val++;
      }
      val = ((3 * ((row + 1) % 3)) + 1) + Math.floor((row + 1) / 3);
    }
  });

  it('should only allow me to place 1 to 9', () => {
    game.placeNumber(0, 0, 0).should.return.false();
    game.getCell(0, 0).should.be.empty();
    game.placeNumber(10, 0, 0).should.return.false();
    game.getCell(0, 0).should.be.empty();
  });

  it('should not try to place in a cell that is out of bounds', () => {
    game.placeNumber(1, -1, 0).should.return.false();
    game.placeNumber(1, 0, -1).should.return.false();
    game.placeNumber(1, 9, 0).should.return.false();
    game.placeNumber(1, 0, 9).should.return.false();
  });

  it('should only allow me to place a number if the cell is not empty', () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        game.placeNumber(1, row, col).should.return.true();
        game.placeNumber(2, row, col).should.return.false();
        game.getCell(row, col).should.match({value: 1});
        game = new Sudoko();
      }
    }
  });

  it('should not allow me to place the same number in a row', () => {
    var val = 1;
    for (let row = 0; row < 9; row++) {
      game.placeNumber(val, row, 0);
      for (let col = 1; col < 9; col++) {
        game.placeNumber(val, row, col);
        game.getCell(row, col).should.be.empty();
      }
      game = new Sudoko();
    }
  });

  it('should not allow me to place the same number in a column', () => {
    var val = 1;
    for (let col = 0; col < 9; col++) {
      game.placeNumber(val, 0, col);
      for (let row = 1; row < 9; row++) {
        game.placeNumber(val, row, col);
        game.getCell(row, col).should.be.empty();
      }
      game = new Sudoko();
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
              game.placeNumber(val, row + i, col + j).should.return.false();
              game.getCell(row + i, col + j).should.be.empty();
            }
          }
        }
        game = new Sudoko();
      }
    }
  });

  it('should allow me to remove my number', () => {
    game.placeNumber(1, 0, 0, false);
    game.removeNumber(0, 0).should.return.true();
    game.getCell(0, 0).should.be.empty();
  });

  it('should not try to remove an empty number', () => {
    game.removeNumber(1, 0, 0).should.return.false();
    game.placeNumber(1, 0, 0).should.return.true();
  });

  it('should not allow me to remove another player\'s number', () => {
    game.placeNumber(1, 0, 0);
    game.removeNumber(0, 0).should.return.false();
    game.getCell(0, 0).should.not.be.empty();
  });

  it('should not allow me to place the last removed number on the same cell', () => {
    game.placeNumber(1, 0, 0, false);
    game.removeNumber(0, 0);
    game.placeNumber(1, 0, 0).should.return.false();
    game.getCell(0, 0).should.be.empty();
  });

  it('should allow me to move my number to the same row', () => {
    var val = 1;
    for (let row = 0; row < 9; row++) {
      for (let col = 1; col < 9; col++) {
        game.placeNumber(val, row, 0, false);
        game.moveNumber(row, 0, row, col).should.return.true();
        game.getCell(row, col).should.match({value: val});
        game.getCell(row, 0).should.be.empty();
        game = new Sudoko();
      }
    }
  });

  it('should allow me to move my number to the same column', () => {
    var val = 1;
    for (let col = 0; col < 9; col++) {
      for (let row = 1; row < 9; row++) {
        game.placeNumber(val, 0, col, false);
        game.moveNumber(0, col, row, col).should.return.true();
        game.getCell(row, col).should.match({value: val});
        game.getCell(0, col).should.be.empty();
        game = new Sudoko();
      }
    }
  });

  it('should allow me to move my number to the same nonet', () => {
    var val = 1;
    for (let row = 0; row < 9; row += 3) {
      for (let col = 0; col < 9; col += 3) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            game.placeNumber(val, row, col, false);
            if (i + j !== 0) {
              game.moveNumber(row, col, row + i, col + j).should.return.true();
              game.getCell(row + i, col + j).should.match({value: val});
              game.getCell(row, col).should.be.empty();
            }
            game = new Sudoko();
          }
        }
      }
    }
  });

  it('should not allow me to move my number anywhere else', () => {
    var val = 1;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        game.placeNumber(val, 0, 0, false);
        if (row !== 0 && col !== 0 && (Math.floor(row / 3) !== 0 && Math.floor(col / 3) !== 0)) {
          game.moveNumber(0, 0, row, col).should.return.false();
          game.getCell(0, 0).should.match({value: val});
          game.getCell(row, col).should.be.empty();
        }
        game = new Sudoko();
      }
    }
  });

  it('should not allow me to move another player\'s number', () => {
    game.placeNumber(1, 0, 0);
    game.moveNumber(0, 0, 1, 0).should.return.false();
    game.getCell(0, 0).should.match({value: 1});
    game.getCell(1, 0).should.be.empty();
  });

  it('should not allow me to move an empty cell', () => {
    game.moveNumber(0, 0, 1, 0).should.return.false();
    game.getCell(1, 0).should.be.empty();
  });

  it('should not try to move a cell that is out of bounds', () => {
    game.placeNumber(1, 0, 0, false);
    game.moveNumber(0, 0, -1, 0).should.return.false();
    game.moveNumber(0, 0, 0, -1).should.return.false();
    game.moveNumber(0, 0, 9, 0).should.return.false();
    game.moveNumber(0, 0, 0, 9).should.return.false();
    game.getCell(0, 0).should.match({value: 1});
  });

  it('should not allow me to move my number to another number', () => {
    game.placeNumber(1, 0, 0);
    game.placeNumber(2, 1, 0);
    game.moveNumber(0, 0, 1, 0).should.return.false();
    game.getCell(0, 0).should.match({value: 1});
    game.getCell(1, 0).should.match({value: 2});
  });

  it('should not allow me to move my number to an illegal position', () => {
    game.placeNumber(1, 0, 0);
    game.placeNumber(1, 8, 8);

    game.moveNumber(0, 0, 8, 0).should.return.false();
    game.getCell(0, 0).should.match({value: 1});
    game.getCell(8, 0).should.be.empty();

    game.moveNumber(0, 0, 0, 8).should.return.false();
    game.getCell(0, 0).should.match({value: 1});
    game.getCell(0, 8).should.be.empty();
  });

  it('should call the callback when I complete a row', (done) => {
    game = new Sudoko((player) => {
      player.should.be.exactly(1);
      done();
    });
    for (let i = 0; i < 9; i++) {
      game.placeNumber(i + 1, 0, i);
    }
  });

  it('should call the callback when I complete a column', (done) => {
    game = new Sudoko((player) => {
      player.should.be.exactly(1);
      done();
    });
    for (let i = 0; i < 9; i++) {
      game.placeNumber(i + 1, i, 0);
    }
  });

  it('should call the callback when I complete a nonet', (done) => {
    game = new Sudoko((player) => {
      player.should.be.exactly(1);
      done();
    });
    var val = 1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        game.placeNumber(val++, i, j);
      }
    }
  });
});