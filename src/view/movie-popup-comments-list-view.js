import SmartsView from './smart-view';

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

export default class MoviePopupCommentsListView extends SmartsView {
  constructor(data) {
    super(data);
  }

  _restoreHandlers() {}

  getTemplate() {
    return (
      `<ul class="film-details__comments-list">
        ${this._data.comments.map(mapComment).join(`\n`)}
      </ul>`
    );
  }
}
