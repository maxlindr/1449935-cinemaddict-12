import {createElement} from '../utils.js';

const createStatsElement = (value) => {
  return `${value} movies inside`;
};

export default class StatsView {
  constructor(value) {
    this._element = null;
    this._value = value;
  }

  getTemplate() {
    return createStatsElement(this._value);
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
}
