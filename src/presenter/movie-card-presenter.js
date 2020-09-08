import MovieCardView from '../view/movie-card';
import MovieCardControlsView from '../view/movie-card-controls-view';
import {render, RenderPosition} from '../render.js';

export default class MovieCardPresenter {
  constructor(container, movie) {
    this._container = container;
    this._view = null;
    this._controlsView = null;

    this._clickHandler = this._clickHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._watchlistChangeHandler = this._watchlistChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);

    this.update(movie);
  }

  setClickHandler(callback) {
    this._clickCallback = callback;
  }

  setChangeHandler(callback) {
    this._changeCallback = callback;
  }

  _clickHandler(evt) {
    this._clickCallback(evt);
  }

  _favoriteChangeHandler(evt) {
    evt.preventDefault();
    this._changeCallback(Object.assign({}, this._movie, {favorite: !this._movie.favorite}));
  }

  _watchedChangeHandler(evt) {
    evt.preventDefault();
    this._changeCallback(Object.assign({}, this._movie, {watched: !this._movie.watched}));
  }

  _watchlistChangeHandler(evt) {
    evt.preventDefault();
    this._changeCallback(Object.assign({}, this._movie, {watchlist: !this._movie.watchlist}));
  }

  update(movie) {
    this._movie = movie;

    if (this._view) {
      this._controlsView.updateData(movie);
      return;
    }

    this._view = new MovieCardView(movie);

    const controlsData = {
      favorite: movie.favorite,
      watched: movie.watched,
      watchlist: movie.watchlist
    };

    this._controlsView = new MovieCardControlsView(controlsData);
    render(this._view, this._controlsView, RenderPosition.BEFOREEND);

    this._controlsView.setWatchedChangeHandler(this._watchedChangeHandler);
    this._controlsView.setWatchlistChangeHandler(this._watchlistChangeHandler);
    this._controlsView.setFavoriteChangeHandler(this._favoriteChangeHandler);

    this._view.setClickHandler(this._clickHandler);
    this._container.append(this._view);
  }
}
