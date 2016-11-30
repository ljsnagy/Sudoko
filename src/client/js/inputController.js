import $ from 'zepto';

/**
 * Displays input controls and captures user input.
 */
export default class InputController {
  /**
   * Construct new input controller.
   * @param {node} container - DOM element that will contain the controls.
   */
  constructor(container) {
    this._$container = $(container).addClass('input-controller');
  }

  /**
   * Clears the controller inputs.
   */
  clear() {
    this._$container.children().remove();
  }

  /**
   * Displays the controls to insert a number.
   * @param {[number]} numbers - Array of numbers to display.
   * @param {function} callback - Called with the number selected.
   */
  insert(numbers, callback) {
    // clear any previous controls first
    this.clear();

    // display our number options
    numbers.forEach((num) => {
      var $opt = $(`<div class="input-option">${num}</div>`);

      // click handler for the option
      $opt.on('click', () => callback(num));

      this._$container.append($opt);
    });
  }

  /**
   * Displays the controls to modify (remove/move) a number.
   * @param {function} callback - Called with the action chosen.
   */
  modify(callback) {
    // clear any previous controls first
    this.clear();

    var $removeOpt = $('<div class="input-option remove">Remove</div>');
    $removeOpt.on('click', () => callback('remove'));

    var $moveOpt = $('<div class="input-option">Move</div>');
    $moveOpt.on('click', () => callback('move'));

    this._$container.append([$removeOpt, $moveOpt]);
  }
}