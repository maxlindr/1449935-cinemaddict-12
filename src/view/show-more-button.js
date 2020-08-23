import AbstractView from './abstract-view';

const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreButtonView extends AbstractView {
  constructor() {
    super();
    this._callback = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    this._callback(evt);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  setClickHandler(callback) {
    this._callback = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  removeClickHandler() {
    this._callback = null;
    this.getElement().removeEventListener(`click`, this._clickHandler);
  }
}
