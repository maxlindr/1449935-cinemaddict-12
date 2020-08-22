import AbstractView from './abstract-view';

const createMoviesContainerTemplate = () => {
  return `<section class="films"></section>`;
};

export default class MoviesContainerView extends AbstractView {
  constructor() {
    super();
    this._element = null;
  }

  getTemplate() {
    return createMoviesContainerTemplate();
  }
}
