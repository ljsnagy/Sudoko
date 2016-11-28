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
   * Displays the controls to insert a number.
   * @param {[number]} numbers - Array of numbers to display.
   * @param {function} callback - Called with the number selected.
   */
  insert(numbers, callback) {
    // clear any previous controls first
    this._$container.children().remove();

    // display our number options
    numbers.forEach((num) => {
      var $opt = $(`<div class="input-option">${num}</div>`);

      // click handler for the option
      $opt.on('click', () => callback(num));

      this._$container.append($opt);
    });
  }
}