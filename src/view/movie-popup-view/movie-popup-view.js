import SmartView from '../abstract/smart-view';
import {formatDuration} from '../../utils.js';
import moment from 'moment';

const joinArrayElementsToString = (arr) => arr.join(`, `);

const formatMovieDate = (movieDate) => moment(movieDate).format(`D MMMM YYYY`);

const mapGenre = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createMovieDetailsPopupTemplate = (movieDto) => {
  const genreElements = movieDto.genres.map(mapGenre).join(`\n`);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${movieDto.poster}" alt="">

              <p class="film-details__age">${movieDto.ageRating + `+`}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${movieDto.title}</h3>
                  <p class="film-details__title-original">Original: ${movieDto.originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${movieDto.rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tbody><tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${movieDto.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${joinArrayElementsToString(movieDto.writers)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${joinArrayElementsToString(movieDto.cast)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatMovieDate(movieDto.releaseDate)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatDuration(movieDto.duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${movieDto.country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${movieDto.genres.length > 1 ? `Genres` : `Genre`}</td>
                  <td class="film-details__cell">
                    ${genreElements}
                  </td>
                </tr>
              </tbody></table>

              <p class="film-details__film-description">
                ${movieDto.description}
              </p>
            </div>
          </div>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MovieDetailsPopupView extends SmartView {
  constructor(movie) {
    super(movie);

    this._closeCallback = null;
    this._favoriteChangeCallback = null;
    this._watchedChangeCallback = null;
    this._watchlistChangeCallback = null;

    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._watchlistChangeHandler = this._watchlistChangeHandler.bind(this);
  }

  _closeBtnClickHandler() {
    if (this._closeCallback) {
      this._closeCallback();
    }
  }

  _favoriteChangeHandler() {
    if (this._favoriteChangeCallback) {
      this._favoriteChangeCallback();
    }
  }

  _watchedChangeHandler() {
    if (this._watchedChangeCallback) {
      this._watchedChangeCallback();
    }
  }

  _watchlistChangeHandler() {
    if (this._watchlistChangeCallback) {
      this._watchlistChangeCallback();
    }
  }

  getTemplate() {
    return createMovieDetailsPopupTemplate(this._data);
  }

  setCloseHandler(callback) {
    this._closeCallback = callback;
  }

  removeCloseHandler() {
    this._closeCallback = () => {};
  }

  setWatchedChangeHandler(callback) {
    this._watchedChangeCallback = callback;
  }

  setWatchlistChangeHandler(callback) {
    this._watchlistChangeCallback = callback;
  }

  setFavoriteChangeHandler(callback) {
    this._favoriteChangeCallback = callback;
  }

  removeCloseHandler() {
    this._closeCallback = null;
  }

  _restoreHandlers() {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeBtnClickHandler);
  }
}
