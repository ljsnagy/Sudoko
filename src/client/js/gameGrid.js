import $ from 'zepto';

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
    this._$container = $(container).addClass('grid-container');
    this._controller = controller;

    for (let row = 0; row < 9; row++) {
      // make our row divs
      let $row = $('<div/>', { class:'grid-row' });

      // insert into the container
      this._$container.append($row);

      for (let col = 0; col < 9; col++) {
        // make our cell divs
        let $cell = $('<div/>', { class:'grid-cell' });

        // keep track of what row and column the cell belongs to
        $cell.data('row', row).data('col', col);

        // insert into the corresponding row div
        $row.append($cell);
      }
    }
  }
}