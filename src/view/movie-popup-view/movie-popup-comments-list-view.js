import SmartView from '../abstract/smart-view';
import moment from 'moment';
import he from "he";
import {EMOJIES} from '../../constants';

const SHAKE_ANIMATION_TIMEOUT = 600;
const SHAKE_ANIMATION_TIMEOUT_IN_SEC = SHAKE_ANIMATION_TIMEOUT / 1000;

moment.locale(`en`);

const formatCommentDate = (commentDate) => moment(commentDate).fromNow();

const mapComment = (comment, disabled, deleting) => {
  return (
    `<li class="film-details__comment" data-id="${comment.id}">
      <span class="film-details__comment-emoji">
        <img src="${EMOJIES[comment.emoji].url}" alt="${EMOJIES[comment.emoji].alt}" width="55" height="55">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.message)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${formatCommentDate(comment.date)}</span>
          <button class="film-details__comment-delete" data-id="${comment.id}" ${disabled ? `disabled` : ``}>${deleting ? `Deleting...` : `Delete`}</button>
        </p>
      </div>
    </li>`
  );
};

const isCommentsEquals = (comments1, comments2) => {
  if (comments1.length !== comments2.length) {
    return false;
  }

  return comments1.every((comment, i) => comment.id === comments2[i].id);
};

export default class MoviePopupCommentsListView extends SmartView {
  constructor(stateData, deleteCallback = () => {}) {
    super(stateData);

    this._deleteClickCallback = deleteCallback;

    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  showError(commentId) {
    const commentsElementsList = Array.from(this.getElement().querySelectorAll(`.film-details__comment`));
    const commentElement = commentsElementsList.find((item) => item.dataset.id === commentId);

    commentElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT_IN_SEC}s`;
    setTimeout(() => (commentElement.style.animation = ``), SHAKE_ANIMATION_TIMEOUT);
  }

  getTemplate() {
    return (
      `<ul class="film-details__comments-list">
        ${this._data.comments.map((comment) => mapComment(comment, this._data.disabled, comment.id === this._data.deletingId)).join(`\n`)}
      </ul>`
    );
  }

  _shouldElementUpdate(newState) {
    for (const [key, prop] of Object.entries(newState)) {
      if (key === `comments`) {
        if (isCommentsEquals(this._data.comments, newState.comments)) {
          continue;
        }

        return true;
      }

      if (prop !== this._data[key]) {
        return true;
      }
    }

    return false;
  }

  _restoreHandlers() {
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((element) => element.addEventListener(`click`, this._deleteClickHandler));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._deleteClickCallback(evt.target.dataset.id);
  }
}
