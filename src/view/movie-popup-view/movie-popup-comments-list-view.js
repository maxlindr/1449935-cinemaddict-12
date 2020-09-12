import SmartView from '../abstract/smart-view';
import moment from 'moment';

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

moment.locale(`en`);

const formatCommentDate = (commentDate) => moment(commentDate).fromNow();

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

export default class MoviePopupCommentsListView extends SmartView {
  _restoreHandlers() {}

  getTemplate() {
    return (
      `<ul class="film-details__comments-list">
        ${this._data.comments.map(mapComment).join(`\n`)}
      </ul>`
    );
  }
}