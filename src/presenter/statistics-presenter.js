import StatisticsView from '../view/statistics-view/statistics-view';
import {render, RenderPosition} from '../render.js';
import moment from 'moment';
import {StatsInterval} from '../constants';


const testMovieWatched = (movie) => movie.watched;

const createFilterMovieLastWatchedInterval =
  (interval) => (movie) => moment(movie.watchingDate).isSameOrAfter(moment().subtract(1, interval));

const statsFilters = {
  [StatsInterval.ALL_TIME]: (movies) => movies.filter(testMovieWatched),
  [StatsInterval.TODAY]: (movies) => movies.filter(testMovieWatched).filter(createFilterMovieLastWatchedInterval(`day`)),
  [StatsInterval.WEEK]: (movies) => movies.filter(testMovieWatched).filter(createFilterMovieLastWatchedInterval(`week`)),
  [StatsInterval.MONTH]: (movies) => movies.filter(testMovieWatched).filter(createFilterMovieLastWatchedInterval(`month`)),
  [StatsInterval.YEAR]: (movies) => movies.filter(testMovieWatched).filter(createFilterMovieLastWatchedInterval(`year`)),
};

export default class StatisticsPresenter {
  constructor(container, moviesModel, userProfileModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._userProfileModel = userProfileModel;

    this._statsInterval = StatsInterval.ALL_TIME;

    this._statsIntervalChangeHandler = this._statsIntervalChangeHandler.bind(this);
    this._userProfileModelChangedHandler = this._userProfileModelChangedHandler.bind(this);
    this._moviesModelChanged = this._moviesModelChanged.bind(this);

    this._view = null;
  }

  destroy() {
    if (this._view) {
      this._view.destroy();
      this._view = null;
      this._unsubscribeModels();
    }
  }

  init() {
    if (!this._view) {
      this._data = {user: this._userProfileModel.getProfile()};
      this._view = new StatisticsView(this._createViewData(), this._statsIntervalChangeHandler);
      this._statsInterval = StatsInterval.ALL_TIME;
      render(this._container, this._view, RenderPosition.BEFOREEND);
      this._update();
      this._subscribeModels();
    }
  }

  _createViewData() {
    return Object.assign({}, this._data, {filter: this._statsInterval}, {movies: statsFilters[this._statsInterval](this._moviesModel.getAll())});
  }

  _moviesModelChanged() {
    this._update();
  }

  _subscribeModels() {
    this._moviesModel.registerObserver(this._moviesModelChanged);
    this._userProfileModel.registerObserver(this._userProfileModelChangedHandler);
  }

  _unsubscribeModels() {
    this._moviesModel.unregisterObserver(this._moviesModelChanged);
    this._userProfileModel.unregisterObserver(this._userProfileModelChangedHandler);
  }

  _update() {
    if (!this._view) {
      return;
    }

    this._view.updateData(this._createViewData());
  }

  _userProfileModelChangedHandler(updateType, payload) {
    this._data = Object.assign({}, this._data, payload);
    this._update();
  }

  _statsIntervalChangeHandler(interval) {
    this._statsInterval = interval;
    this._update();
  }
}
