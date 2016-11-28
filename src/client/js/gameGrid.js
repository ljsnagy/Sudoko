import $ from 'zepto';
import AntiSudoku from '../../lib/anti-sudoku.js';

/**
 * Manages display of the game state.
 */
export default class GameGrid {
  /**
   * Construct a new grid.
   * @param {node} container - DOM element to insert the grid into.
   * @param {InputController} controller - Input controller instance.
   */
  constructor(container, controller) {
    this._controller = controller;
    this._game = new AntiSudoku();
    this._$container = $(container).addClass('grid-container');

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
   * Handles the click on a grid cell.
   * @param {object} event - Event object.
   * @private
   */
  _selectCell(event) {
    var $cell = $(event.target);
    var row = $cell.data('row');
    var col = $cell.data('col');

    // remove selected class from any previously selected cell
    this._$container.find('.grid-cell').removeClass('selected');

    // add the sleected class to cell that was clicked
    $cell.addClass('selected');

    // find out what numbers we can place
    var legalNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((num) => {
      return this._game.placeNumber(num, row, col, false, true);
    });

    // prompt an input from user
    this._controller.insert(legalNumbers, (num) => {
      if (this._game.placeNumber(num, row, col)) {
        $cell.text(num);
      }
    });
  }
}