import SmartView from '../abstract/smart-view';
import {animateEmoji} from './emoji-animation';
import {EMOJIES} from '../../constants';

const SHAKE_ANIMATION_TIMEOUT = 600;
const SHAKE_ANIMATION_TIMEOUT_IN_SEC = SHAKE_ANIMATION_TIMEOUT / 1000;

const mapEmojiToPreviewElementString = (emoji) => {
  return `<img src="${EMOJIES[emoji].url}" alt="${EMOJIES[emoji].alt}" width="55" height="55">`;
};

export default class MoviePopupNewCommentView extends SmartView {
  constructor(stateData = {}, addCommentCallback = () => {}) {
    super(stateData);

    this._addCommentCallback = addCommentCallback;

    this._keyDownHandler = this._keyDownHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._commentEmojiChangeHandler = this._commentEmojiChangeHandler.bind(this);
    this._commentTextChangeHandler = this._commentTextChangeHandler.bind(this);
  }

  reset() {
    this.updateData({
      emoji: ``,
      message: ``
    });
  }

  dispose() {
    document.removeEventListener(`keydown`, this._keyDownHandler);
  }

  getTemplate() {
    const disabledAttribute = this._data.disabled ? `disabled` : ``;

    return (
      `<div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">${this._data.emoji ? mapEmojiToPreviewElementString(this._data.emoji) : `` }</div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" required ${disabledAttribute}>${this._data.message || ``}</textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${disabledAttribute}>
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" alt="emoji" width="30" height="30">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${disabledAttribute}>
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" alt="emoji" width="30" height="30">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${disabledAttribute}>
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" alt="emoji" width="30" height="30">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${disabledAttribute}>
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" alt="emoji" width="30" height="30">
          </label>
        </div>
      </div>`
    );
  }

  showError() {
    const root = this.getElement();
    root.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT_IN_SEC}s`;
    setTimeout(() => (root.style.animation = ``), SHAKE_ANIMATION_TIMEOUT);
  }

  _runEmojiMissedAnimation() {
    // анимация лейбла эмодзи комментария
    const emojiLabel = this.getElement().querySelector(`.film-details__add-emoji-label`);
    emojiLabel.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT_IN_SEC}s`;
    setTimeout(() => (emojiLabel.style.animation = ``), SHAKE_ANIMATION_TIMEOUT);

    // анимация кнопок эмодзи
    this.getElement().querySelectorAll(`.film-details__emoji-label`).forEach(animateEmoji);
  }

  _restoreHandlers() {
    this.getElement().querySelectorAll(`.film-details__emoji-item`)
      .forEach((input) => input.addEventListener(`click`, this._commentEmojiChangeHandler));

    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._commentTextChangeHandler);

    if (this._data.disabled) {
      document.removeEventListener(`keydown`, this._keyDownHandler);
    } else {
      document.addEventListener(`keydown`, this._keyDownHandler);
    }
  }

  _addCommentHandler() {
    this._addCommentCallback({
      emoji: this._data.emoji,
      message: this._data.message
    });
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

    const commentInputElement = this.getElement().querySelector(`.film-details__comment-input`);
    const isCommentInputValid = commentInputElement.checkValidity();

    if (this._data.emoji && isCommentInputValid) {
      this._addCommentHandler();
      return;
    }

    if (!this._data.emoji) {
      this._runEmojiMissedAnimation();
    }

    if (!isCommentInputValid) {
      commentInputElement.reportValidity();
    }
  }
}
