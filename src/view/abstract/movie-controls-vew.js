import SmartView from './smart-view';

export default class MovieControlsView extends SmartView {
  constructor(data) {
    super(data);

    this._favoriteClickCallback = null;
    this._watchedClickCallback = null;
    this._watchlistClickCallback = null;

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);

    this._restoreHandlers();
  }

  _favoriteClickHandler(evt) {
    this._favoriteClickCallback(evt);
  }

  _watchedClickHandler(evt) {
    this._watchedClickCallback(evt);
  }

  _watchlistClickHandler(evt) {
    this._watchlistClickCallback(evt);
  }

  setFavoriteChangeHandler(callback) {
    this._favoriteClickCallback = callback;
  }

  setWatchedChangeHandler(callback) {
    this._watchedClickCallback = callback;
  }

  setWatchlistChangeHandler(callback) {
    this._watchlistClickCallback = callback;
  }
}
