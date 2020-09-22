import SmartView from './abstract/smart-view';
import {SortType} from '../constants';

const ACTIVE_CLASSNAME = `sort__button--active`;

export default class MoviesSortBarView extends SmartView {
  constructor(stateData = {sortType: SortType.DEFAULT}) {
    super(stateData);

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return (
      `<ul class="sort">
        <li><a href="#" class="sort__button ${this._data.sortType === SortType.DEFAULT ? ACTIVE_CLASSNAME : ``}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
        <li><a href="#" class="sort__button ${this._data.sortType === SortType.DATE ? ACTIVE_CLASSNAME : ``}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
        <li><a href="#" class="sort__button ${this._data.sortType === SortType.RATING ? ACTIVE_CLASSNAME : ``}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
      </ul>`
    );
  }

  _restoreHandlers() {
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
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
  }
}
