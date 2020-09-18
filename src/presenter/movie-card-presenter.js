import MovieCardView from '../view/movie-card-view/movie-card-view';
import MovieCardControlsView from '../view/movie-card-view/movie-card-controls-view';
import {render, RenderPosition} from '../render.js';
import MovieCardCommentsView from '../view/movie-card-view/movie-card-comments-view';

export default class MovieCardPresenter {
  constructor(container, movie, api) {
    this._container = container;
    this._api = api;

    this._state = {
      disabled: false
    };

    this._view = null;
    this._controlsView = null;
    this._commentsView = null;

    this._clickHandler = this._clickHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._watchlistChangeHandler = this._watchlistChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);

    this.update(movie);
  }

  disable(value) {
    this._setState({disabled: value});
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

  _setState(state) {
    this._state = Object.assign({}, this._state, state);
    this.update(this._movie);
  }

  _updateMovieRequest(movie) {
    this.disable(true);

    return this._api
      .updateMovie(movie)
      .then(() => {
        this.disable(false);
        this._changeCallback(movie);
      })
      .catch(() => {});
  }

  _favoriteChangeHandler() {
    this._updateMovieRequest(Object.assign({}, this._movie, {favorite: !this._movie.favorite}));
  }

  _watchedChangeHandler() {
    const watched = !this._movie.watched;
    const watchingDate = watched ? new Date() : null;

    this._updateMovieRequest(Object.assign({}, this._movie, {watched, watchingDate}));
  }

  _watchlistChangeHandler() {
    this._updateMovieRequest(Object.assign({}, this._movie, {watchlist: !this._movie.watchlist}));
  }

  update(movie) {
    this._movie = movie;
    const commentsCount = movie.comments.length;

    if (this._view) {
      this._controlsView.updateData(Object.assign({}, movie, {disabled: this._state.disabled}));
      this._commentsView.updateData({commentsCount});
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

    this._commentsView = new MovieCardCommentsView({commentsCount});
    this._commentsView.setClickHandler(this._clickHandler);
    render(this._view, this._commentsView, RenderPosition.BEFOREEND);

    this._controlsView.setWatchedChangeHandler(this._watchedChangeHandler);
    this._controlsView.setWatchlistChangeHandler(this._watchlistChangeHandler);
    this._controlsView.setFavoriteChangeHandler(this._favoriteChangeHandler);

    this._view.setClickHandler(this._clickHandler);
    this._container.append(this._view);
  }

  destroy() {
    this._view.destroy();
    this._view = null;
  }
}
