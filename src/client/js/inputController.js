import $ from 'zepto';

/**
 * Displays input controls and captures user input.
 */
export default class InputController {
  /**
   * Construct new input controller.
   * @param {Element} container - DOM element that will contain the controls.
   */
  constructor(container) {
    this._$container = $(container).addClass('input-controller');
  }

  /**
   * Clears the controller inputs.
   * @param {string} [msg] - Optional message to display.
   */
  clear(msg) {
    this._$container.children().remove();
    if (!!msg) this._$container.append(`<div class="input-msg">${msg}</div>`);
  }

  /**
   * Displays the controls to insert a number.
   * @param {[string]|[{name: (string), class: (string)}]} options - Array of inputs to display.
   * @param {function} callback - Called with the option selected.
   */
  select(options, callback) {
    // clear any previous controls first
    this.clear();

    // display our number options
    options.forEach((opt) => {
      var name = opt.name || opt;
      var $opt = $(`<div class="input-option">${name}</div>`);

      // add custom class if present
      if (opt.class) $opt.addClass(opt.class);

      // click handler for the option
      $opt.on('click', () => callback(name));

      this._$container.append($opt);
    });
  }
}