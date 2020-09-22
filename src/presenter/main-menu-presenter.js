import MainMenuView from '../view/main-menu-view';
import {BoardMode} from '../constants';
import {filters} from '../filters';
import {render, RenderPosition} from '../render.js';

export default class MainMenuPresenter {
  constructor(container, filtersModel, moviesModel) {
    this._container = container;
    this._filtersModel = filtersModel;
    this._moviesModel = moviesModel;

    this._view = null;
    this._mode = BoardMode.ALL;

    this._statsClickCallback = () => {};
    this._filterClickCallback = () => {};

    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);

    this._update = this._update.bind(this);

    moviesModel.registerObserver(this._update);

    filtersModel.registerObserver((mode) => {
      this._update();
      this._filterClickCallback(mode);
    });

    this._update();
  }

  removeStatsClickHandler() {
    this._statsClickCallback = () => {};
  }

  removeFilterClickHandler() {
    this._filterClickCallback = () => {};
  }

  setStatsClickHandler(callback) {
    this._statsClickCallback = callback;
  }

  setFilterClickHandler(callback) {
    this._filterClickCallback = callback;
  }

  _update() {
    const movies = this._moviesModel.getAll();

    const filtersCounts = {};
    Object.entries(filters).forEach(([name, filter]) => {
      filtersCounts[name] = filter(movies).length;
    });

    const viewData = {
      filtersCounts,
      mode: this._mode
    };

    if (this._view) {
      this._view.updateData(viewData);
      return;
    }

    this._view = new MainMenuView(viewData);
    this._view.setActiveFilterChangeHandler(this._modeChangeHandler);
    this._view.setStatsClickHandler(this._statsClickHandler);

    render(this._container, this._view, RenderPosition.BEFOREEND);
  }

  _modeChangeHandler(mode) {
    this._mode = mode;
    this._filtersModel.setActive(mode);
  }

  _statsClickHandler() {
    this._statsClickCallback();
  }
}
