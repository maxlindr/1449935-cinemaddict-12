import SmartView from './smart-view';

export default class MovieControlsView extends SmartView {
  constructor(stateData) {
    super(stateData);

    this._favoriteClickCallback = null;
    this._watchedClickCallback = null;
    this._watchlistClickCallback = null;

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._favoriteClickCallback(evt);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._watchedClickCallback(evt);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
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
