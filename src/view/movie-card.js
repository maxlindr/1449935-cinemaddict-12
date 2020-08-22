import AbstractView from './abstract-view';
import {formatDuration} from '../utils.js';

const DESCRIPTION_TRIM_THRESHOLD_LENGTH = 140;

const createMovieCardTemplate = (movieDto) => {
  const year = movieDto.releaseDate.getFullYear();
  const fullDescription = movieDto.description;
  const shortDescription = fullDescription.length <= DESCRIPTION_TRIM_THRESHOLD_LENGTH
    ? fullDescription
    : fullDescription.substring(0, 140) + `…`;

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
      <a class="film-card__comments">${movieDto.comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class MovieCardView extends AbstractView {
  constructor(movie) {
    super();
    this._element = null;
    this._movie = movie;
    this._callback = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    this._callback(evt);
  }

  _getInteractiveElements() {
    return this.getElement().querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`);
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  setClickHandler(callback) {
    this._callback = callback;
    this._getInteractiveElements().forEach((element) => element.addEventListener(`click`, this._clickHandler));
  }

  removeClickHandler() {
    this._callback = null;
    this._getInteractiveElements().forEach((element) => element.removeEventListener(`click`, this._clickHandler));
  }
}
