import AbstractView from './abstract-view';

const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreButtonView extends AbstractView {
  constructor() {
    super();
    this._element = null;
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }
}
