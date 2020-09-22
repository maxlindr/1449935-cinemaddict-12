import SmartView from './abstract/smart-view';
import {BoardMode} from '../constants';

const ACTIVE_ITEM_CLASSNAME = `main-navigation__item--active`;

const createMainMenuTemplate = (stateData) => {
  const {filtersCounts, mode} = stateData;

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item ${mode === BoardMode.ALL ? ACTIVE_ITEM_CLASSNAME : ``}">All movies</a>
        <a href="#watchlist" class="main-navigation__item ${mode === BoardMode.WATCHLIST ? ACTIVE_ITEM_CLASSNAME : ``}">Watchlist <span class="main-navigation__item-count">${filtersCounts[BoardMode.WATCHLIST]}</span></a>
        <a href="#history" class="main-navigation__item ${mode === BoardMode.HISTORY ? ACTIVE_ITEM_CLASSNAME : ``}">History <span class="main-navigation__item-count">${filtersCounts[BoardMode.HISTORY]}</span></a>
        <a href="#favorites" class="main-navigation__item ${mode === BoardMode.FAVORITES ? ACTIVE_ITEM_CLASSNAME : ``}">Favorites <span class="main-navigation__item-count">${filtersCounts[BoardMode.FAVORITES]}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainMenuView extends SmartView {
  constructor(stateData) {
    super(stateData);

    this._filterChangeCallback = () => {};
    this._statsClickCallback = () => {};

    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createMainMenuTemplate(this._data);
  }

  setActiveFilterChangeHandler(callback) {
    this._filterChangeCallback = callback;
  }

  setStatsClickHandler(callback) {
    this._statsClickCallback = callback;
  }

  _restoreHandlers() {
    this.getElement().querySelectorAll(`.main-navigation__item`)
      .forEach((element) => element.addEventListener(`click`, this._filterClickHandler));

    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statsClickHandler);
  }

  _filterClickHandler(evt) {
    evt.preventDefault();

    switch (evt.target.getAttribute(`href`)) {
      case `#all`:
        this._filterChangeCallback(BoardMode.ALL);
        break;
      case `#watchlist`:
        this._filterChangeCallback(BoardMode.WATCHLIST);
        break;
      case `#history`:
        this._filterChangeCallback(BoardMode.HISTORY);
        break;
      case `#favorites`:
        this._filterChangeCallback(BoardMode.FAVORITES);
    }
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._statsClickCallback();
  }
}
