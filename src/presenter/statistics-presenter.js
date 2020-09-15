import StatisticsView from '../view/statistics-view/statistics-view';
import {render, RenderPosition} from '../render.js';
import moment from 'moment';
import {StatsInterval} from '../constants';


const testMovieWatched = (movie) => movie.watched;

const testMovieWatchedInLastDay = (movie) => moment(movie.watchingDate).isSameOrAfter(moment().subtract(1, `day`));
const testMovieWatchedInLastWeek = (movie) => moment(movie.watchingDate).isSameOrAfter(moment().subtract(1, `week`));
const testMovieWatchedInLastMonth = (movie) => moment(movie.watchingDate).isSameOrAfter(moment().subtract(1, `month`));
const testMovieWatchedInLastYear = (movie) => moment(movie.watchingDate).isSameOrAfter(moment().subtract(1, `year`));

const statsFilters = {
  [StatsInterval.ALL_TIME]: (movies) => movies.filter(testMovieWatched),
  [StatsInterval.TODAY]: (movies) => movies.filter(testMovieWatched).filter(testMovieWatchedInLastDay),
  [StatsInterval.WEEK]: (movies) => movies.filter(testMovieWatched).filter(testMovieWatchedInLastWeek),
  [StatsInterval.MONTH]: (movies) => movies.filter(testMovieWatched).filter(testMovieWatchedInLastMonth),
  [StatsInterval.YEAR]: (movies) => movies.filter(testMovieWatched).filter(testMovieWatchedInLastYear),
};

export default class StatisticsPresenter {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._statsInterval = StatsInterval.ALL_TIME;

    this._statsIntervalChangeHandler = this._statsIntervalChangeHandler.bind(this);
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

  init(data) {
    if (!this._view) {
      this._data = data;
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

  _statsIntervalChangeHandler(interval) {
    this._statsInterval = interval;
    this._update();
  }

  _moviesModelChanged() {
    this._update();
  }

  _subscribeModels() {
    this._moviesModel.registerObserver(this._moviesModelChanged);
  }

  _unsubscribeModels() {
    this._moviesModel.unregisterObserver(this._moviesModelChanged);
  }

  _update() {
    if (!this._view) {
      return;
    }

    this._view.updateData(this._createViewData());
  }
}
