import SmartView from '../abstract/smart-view';

export default class MovieCardCommentsView extends SmartView {
  constructor(stateData) {
    super(stateData);

    this._clickCallback = () => {};

    this._clickHandler = this._clickHandler.bind(this);
  }

  setClickHandler(callback) {
    this._clickCallback = callback;
  }

  getTemplate() {
    return (
      `<a class="film-card__comments">${this._data.commentsCount} comments</a>`
    );
  }

  _restoreHandlers() {
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._clickCallback();
  }
}
