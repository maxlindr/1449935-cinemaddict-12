import {createElement} from '../../utils.js';

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Can't instantiate AbstractView, only concrete one.`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`Not implemented`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  destroy() {
    if (this._element) {
      this._element.remove();
      this.removeElement();
    }
  }
}
