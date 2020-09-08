import AbstractView from './abstract/abstract-view';

const createMoviesContainerTemplate = () => {
  return `<section class="films"></section>`;
};

export default class MoviesContainerView extends AbstractView {
  getTemplate() {
    return createMoviesContainerTemplate();
  }
}
