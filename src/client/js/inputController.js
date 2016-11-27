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
   */
  insert() {
    // clear any previous controls first
    this._$container.children().remove();

    // display our number options
    for (let num = 1; num <= 9; num++) {
      let $opt = $(`<div class="input-option">${num}</div>`);

      // click handler for the option
      $opt.on('click', () => {
        console.log(num);
      });

      this._$container.append($opt);
    }
  }
}