import SmartView from '../abstract/smart-view';
import {formatDuration} from '../../utils.js';

const DESCRIPTION_TRIM_THRESHOLD_LENGTH = 140;

const createMovieCardTemplate = (movieDto) => {
  const year = movieDto.releaseDate.getFullYear();
  const fullDescription = movieDto.description;
  const shortDescription = fullDescription.length <= DESCRIPTION_TRIM_THRESHOLD_LENGTH
    ? fullDescription
    : fullDescription.substring(0, DESCRIPTION_TRIM_THRESHOLD_LENGTH) + `…`;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${movieDto.title}</h3>
      <p class="film-card__rating">${movieDto.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${formatDuration(movieDto.duration)}</span>
        <span class="film-card__genre">${movieDto.genres[0]}</span>
      </p>
      <img src="${movieDto.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
    </article>`
  );
};

export default class MovieCardView extends SmartView {
  constructor(movie) {
    super(movie);
    this._clickCallback = null;

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createMovieCardTemplate(this._data);
  }

  setClickHandler(callback) {
    this._clickCallback = callback;
  }

  _restoreHandlers() {
    this.getElement().querySelectorAll(`.film-card__poster, .film-card__title`)
      .forEach((it) => it.addEventListener(`click`, this._clickHandler));
  }

  _clickHandler(evt) {
    this._clickCallback(evt);
  }
}
