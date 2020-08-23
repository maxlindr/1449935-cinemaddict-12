import MoviesBoardView from './movies-board-view';

const createMoviesExtraBoard = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

export default class MoviesExtraBoardView extends MoviesBoardView {
  constructor(title) {
    super();
    this._element = null;
    this._title = title;
  }

  getTemplate() {
    return createMoviesExtraBoard(this._title);
  }
}
