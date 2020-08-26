import AbstractView from './abstract-view';
import {SortType} from '../constants';

const createMoviesSortBarTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class MoviesSortBarView extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMoviesSortBarTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._sortTypeChangeCallback(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._sortTypeChangeCallback = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
