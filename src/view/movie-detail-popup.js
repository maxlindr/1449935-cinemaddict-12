import AbstractView from './abstract-view';
import {formatDuration} from '../utils.js';

const EMOJIES = {
  angry: {
    url: `./images/emoji/angry.png`,
    alt: `emoji-angry`
  },
  puke: {
    url: `./images/emoji/puke.png`,
    alt: `emoji-puke`
  },
  sleeping: {
    url: `./images/emoji/sleeping.png`,
    alt: `emoji-sleeping`
  },
  smile: {
    url: `./images/emoji/smile.png`,
    alt: `emoji-smile`
  },
};

const joinArrayElementsToString = (arr) => arr.join(`, `);

const formatMovieDate = (movieDate) => {
  const month = movieDate.toLocaleDateString(`en-US`, {month: `long`});
  const date = movieDate.getDate();
  const year = movieDate.getFullYear();
  return `${date} ${month} ${year}`;
};

const mapGenre = (genre) => `<span class="film-details__genre">${genre}</span>`;

const formatCommentDate = (commentDate) => {
  const RELATIVE_DATE_THRESHOLD_DAYS = 30;
  const MS_IN_DAY = 1000 * 60 * 60 * 24;

  const now = new Date();
  const nowInMs = now.getTime();
  const year = commentDate.getFullYear();
  const month = commentDate.getMonth() + 1;
  const date = commentDate.getDate();
  const hours = commentDate.getHours();
  const minutes = commentDate.getMinutes();

  const daysPassed = (nowInMs - commentDate.getTime()) / MS_IN_DAY;

  if (
    now.getFullYear() === year &&
    now.getMonth() === commentDate.getMonth() &&
    now.getDate() === date
  ) {
    return `Today`;
  } else if (daysPassed < 1) {
    return `Yesterday`;
  } else if (daysPassed <= RELATIVE_DATE_THRESHOLD_DAYS) {
    const dayOrDays = daysPassed > 1 ? `days` : `day`;
    return `${daysPassed} ${dayOrDays} ago`;
  }

  return `${year}/${month}/${date} ${hours}:${String(minutes).padStart(2, `0`)}`;
};

const mapComment = (comment) => {
  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${EMOJIES[comment.emoji].url}" alt="${EMOJIES[comment.emoji].alt}" width="55" height="55">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.message}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${formatCommentDate(comment.date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};

const createMovieDetailsPopupTemplate = (movieDto) => {
  const genreElements = movieDto.genres.map(mapGenre).join(`\n`);
  const commentElements = movieDto.comments.map(mapComment).join(`\n`);

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

              <p class="film-details__age">${movieDto.ageRating}</p>
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
                  <td class="film-details__term">Genres</td>
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

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${movieDto.comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentElements}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" alt="emoji" width="30" height="30">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" alt="emoji" width="30" height="30">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" alt="emoji" width="30" height="30">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" alt="emoji" width="30" height="30">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MovieDetailsPopupView extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;
    this._callback = null;
    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
  }

  _closeBtnClickHandler() {
    this._callback();
  }

  _getCloseBtnElement() {
    return this.getElement().querySelector(`.film-details__close-btn`);
  }

  getTemplate() {
    return createMovieDetailsPopupTemplate(this._movie);
  }

  setCloseHandler(callback) {
    this._callback = callback;
    this._getCloseBtnElement().addEventListener(`click`, this._closeBtnClickHandler);
  }

  removeCloseHandler() {
    this._callback = null;
    this._getCloseBtnElement().removeEventListener(`click`, this._closeBtnClickHandler);
  }
}
