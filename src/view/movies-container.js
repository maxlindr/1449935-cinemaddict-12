import {createElement} from '../utils.js';

const createMoviesContainerTemplate = () => {
  return `<section class="films"></section>`;
};

export default class MoviesContainerView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoviesContainerTemplate();
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
