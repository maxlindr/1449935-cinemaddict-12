import AbstractView from './abstract-view';

const createAllMoviesBoardTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

export default class AllMoviesBoardView extends AbstractView {
  constructor() {
    super();
    this._element = null;
  }

  getTemplate() {
    return createAllMoviesBoardTemplate();
  }
}
