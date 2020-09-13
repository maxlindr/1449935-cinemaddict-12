import SmartView from '../abstract/smart-view';

export default class MovieCardCommentsView extends SmartView {
  constructor(data) {
    super(data);

    this._clickCallback = () => {};

    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._clickCallback();
  }

  _restoreHandlers() {
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  setClickHandler(callback) {
    this._clickCallback = callback;
  }

  getTemplate() {
    return (
      `<a class="film-card__comments">${this._data.commentsCount} comments</a>`
    );
  }
}
