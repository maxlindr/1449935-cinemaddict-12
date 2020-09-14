import SmartView from '../abstract/smart-view';
import {animateEmoji} from './emoji-animation';

const SHAKE_ANIMATION_TIMEOUT = 600;
const SHAKE_ANIMATION_TIMEOUT_IN_SEC = SHAKE_ANIMATION_TIMEOUT / 1000;

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

const mapEmojiToPreviewElementString = (emoji) => {
  return `<img src="${EMOJIES[emoji].url}" alt="${EMOJIES[emoji].alt}" width="55" height="55">`;
};

export default class MoviePopupNewCommentView extends SmartView {
  constructor(data = {}) {
    super(data);

    this._addCommentCallback = () => {};

    this._keyDownHandler = this._keyDownHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._commentEmojiChangeHandler = this._commentEmojiChangeHandler.bind(this);
    this._commentTextChangeHandler = this._commentTextChangeHandler.bind(this);
  }

  _addCommentHandler() {
    this._addCommentCallback(this._data);
    this._data = {};
    this.updateElement();
  }

  dispose() {
    document.removeEventListener(`keydown`, this._keyDownHandler);
  }

  _commentEmojiChangeHandler(evt) {
    this.updateData({emoji: evt.target.value});
  }

  _commentTextChangeHandler(evt) {
    this.updateData({message: evt.target.value}, true);
  }

  // обработчик на нажатие Ctrl/Command + Enter
  _keyDownHandler(evt) {
    if (!evt.ctrlKey || evt.key !== `Enter`) {
      return;
    }

    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);
    const isCommentInputValid = commentInput.checkValidity();

    if (this._data.emoji && isCommentInputValid) {
      this._addCommentHandler();
      return;
    }

    if (!this._data.emoji) {
      this._runEmojiMissedAnimation();
    }

    if (!isCommentInputValid) {
      commentInput.reportValidity();
    }
  }

  _restoreHandlers() {
    this.getElement().querySelectorAll(`.film-details__emoji-item`)
      .forEach((input) => input.addEventListener(`click`, this._commentEmojiChangeHandler));

    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._commentTextChangeHandler);

    document.addEventListener(`keydown`, this._keyDownHandler);
  }

  getTemplate() {
    return (
      `<div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">${this._data.emoji ? mapEmojiToPreviewElementString(this._data.emoji) : `` }</div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" required>${this._data.message || ``}</textarea>
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
      </div>`
    );
  }

  setAddCommentHandler(callback) {
    this._addCommentCallback = callback;
  }

  _runEmojiMissedAnimation() {
    // анимация лейбла эмодзи комментария
    const emojiLabel = this.getElement().querySelector(`.film-details__add-emoji-label`);
    emojiLabel.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT_IN_SEC}s`;
    setTimeout(() => (emojiLabel.style.animation = ``), SHAKE_ANIMATION_TIMEOUT);

    // анимация кнопок эмодзи
    this.getElement().querySelectorAll(`.film-details__emoji-label`).forEach(animateEmoji);
  }
}
