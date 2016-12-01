import $ from 'zepto';
import AntiSudoku from '../../lib/anti-sudoku.js';

/**
 * Manages and displays the game state.
 */
export default class GameGrid {
  /**
   * Create a new game.
   * @param {number} player - Assigned player number.
   * @param {node} container - DOM element to insert the grid into.
   * @param {InputController} controller - Input controller instance.
   */
  constructor(player, container, controller) {
    this._player = player;
    this._$container = $(container).addClass('grid-container');
    this._controller = controller;
    this._game = new AntiSudoku();

    this._constructGrid();
    if (this._player !== 1) this._setWaiting();
  }

  /**
   * Constructs the grid interface to display to game state.
   */
  _constructGrid() {
    for (let row = 0; row < 9; row++) {
      // make our row divs
      let $row = $('<div/>', { class:'grid-row' });

      // insert into the container
      this._$container.append($row);

      for (let col = 0; col < 9; col++) {
        // make our cell divs
        let $cell = $('<div/>', { class:'grid-cell' });

        // click handler
        $cell.on('click', (event) => this._selectCell(event));

        // keep track of what row and column the cell belongs to
        $cell.data('row', row).data('col', col);

        // insert into the corresponding row div
        $row.append($cell);
      }
    }
  }

  /**
   * Returns the Zepto collection representing the cell at a given row and column.
   * @param {number} row
   * @param {number} col
   * @returns {object} - Zepto collection.
   * @private
   */
  _getCell(row, col) {
    return this._$container.find(`[data-row="${row}"][data-col="${col}"]`);
  }

  /**
   * Removes temporary state classes from any previous cells.
   * @private
   */
  _clearState() {
    this._$container.find('.grid-cell').removeClass('selected highlighted');
  }

  /**
   * Displays a waiting message.
   * @private
   */
  _setWaiting() {
    this._controller.clear(`Waiting for Player ${this._game.getPlayer()}...`);
  }

  /**
   * Handles the click on a grid cell.
   * @param {object} event - Event object.
   * @private
   */
  _selectCell(event) {
    if (this._player !== this._game.getPlayer()) return;

    var $cellElem = $(event.target);

    var row = $cellElem.data('row');
    var col = $cellElem.data('col');

    var cell = this._game.getCell(row, col);

    this._clearState();

    // add the selected class to cell that was clicked
    $cellElem.addClass('selected');

    // check if we're selecting a cell to move a number to
    if (!!this._moveCell) {
      // grab the row and column for the cell being moved
      let srcRow = this._moveCell.data('row');
      let srcCol = this._moveCell.data('col');

      // clear the move cell state
      this._moveCell = null;

      // move our number
      this.moveNumber(srcRow, srcCol, row, col);
    }

    if (!cell.value) {
      // find out what numbers we can place
      var legalNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((num) => {
        return this._game.placeNumber(num, row, col, false, true);
      });

      // prompt user for number to place
      this._controller.insert(legalNumbers, (num) => this.placeNumber(num, row, col));
    } else if (cell.player === this._player) {
      // cell has a value and we own it
      // show options to modify the cell
      this._controller.modify((action) => {
        if (action === 'remove') {
          // remove the number
          this.removeNumber(row, col);
        } else if (action === 'move') {
          // player wants to move - store the cell for the next selection
          this._moveCell = $cellElem;

          // go through all cells
          for (let dstCol = 0; dstCol < 9; dstCol++) {
            for (let dstRow = 0; dstRow < 9; dstRow++) {
              if (this._game.moveNumber(row, col, dstRow, dstCol, false, true)) {
                // highlight the cells we can move to
                this._getCell(dstRow, dstCol).addClass('highlighted');
              }
            }
          }
        }
      });
    } else {
      // cell has a value and it's not ours
      // clear the controller
      this._controller.clear();
    }
  }

  /**
   * Inserts the number into the grid.
   * @param {number} num - Number to insert.
   * @param {number} row - Row to insert at.
   * @param {number} col - Column to insert at.
   */
  placeNumber(num, row, col) {
    var $cell = this._getCell(row, col);
    var currPlayer = this._game.getPlayer();

    if (this._game.placeNumber(num, row, col)) {
      $cell
        .removeClass('removed')
        .addClass(`player-${currPlayer}`)
        .text(num);

      this._clearState();
      this._setWaiting();
    }
  }

  /**
   * Removes a number from the grid.
   * @param {number} row - Row to remove.
   * @param {number} col - Column to remove.
   */
  removeNumber(row, col) {
    var $cell = this._getCell(row, col);

    if (this._game.removeNumber(row, col)) {
      $cell.removeClass('player-1 player-2').addClass('removed');

      this._clearState();
      this._setWaiting();
    }
  }

  /**
   * Moves a number from one cell to another.
   * @param {number} srcRow - Row to move number from.
   * @param {number} srcCol - Column to move number from.
   * @param {number} dstRow - Row to move number to.
   * @param {number} dstCol - Column to move number to.
   */
  moveNumber(srcRow, srcCol, dstRow, dstCol) {
    var $srcCell = this._getCell(srcRow, srcCol);
    var $dstCell = this._getCell(dstRow, dstCol);
    var currPlayer = this._game.getPlayer();

    if (this._game.moveNumber(srcRow, srcCol, dstRow, dstCol)) {
      $dstCell.addClass(`player-${currPlayer}`).text($srcCell.text());
      $srcCell.removeClass('player-1 player-2').addClass('removed');

      this._clearState();
      this._setWaiting();
    }
  }
}