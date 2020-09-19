import MoviePopupView from '../view/movie-popup-view/movie-popup-view';
import MoviePopupControlsView from '../view/movie-popup-view/movie-popup-controls-view';
import MoviePopupNewCommentView from '../view/movie-popup-view/movie-popup-new-comment-view';
import MoviePopupCommentsCountView from '../view/movie-popup-view/movie-popup-comments-count-view';
import MoviePopupCommentsListView from '../view/movie-popup-view/movie-popup-comments-list-view';
import {render, RenderPosition} from '../render.js';
import CommentsModel from '../models/comments-model';

export default class MoviePopupPresenter {
  constructor(container, movie, commentsModel, api) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._movie = movie;
    this._api = api;

    this._state = {
      disabled: false,
      deletingCommentId: null,
    };

    this._escapeKeyDownHandler = this._escapeKeyDownHandler.bind(this);
    this._commentAddHandler = this._commentAddHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._watchlistChangeHandler = this._watchlistChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._handleUpdateMovieRequestError = this._handleUpdateMovieRequestError.bind(this);

    this.close = this.close.bind(this);

    this._closeCallback = () => {};

    this.update(movie);
  }

  _escapeKeyDownHandler(escDownEvt) {
    if (escDownEvt.key === `Escape`) {
      this.close();
    }
  }

  _commentAddHandler(data) {
    const newComment = {
      emoji: data.emoji,
      message: data.message,
      date: new Date()
    };

    this.disable(true);

    this._api
      .addComment(this._movie.id, newComment)
      .then(({comments}) => this._commentsModel.add(comments.map(CommentsModel.adaptToClient), this._movie.id))
      .then(() => {
        this.disable(false);
        this._newCommentView.reset();
      })
      .catch(() => {
        this.disable(false);
        this._newCommentView.showError();
      });
  }

  _deleteCommentHandler(commentId) {
    this._setState({
      deletingCommentId: commentId,
      disabled: true
    });

    this._api
      .deleteComment(commentId)
      .then(() => this._commentsModel.delete(commentId, this._movie.id))
      .catch(() => {})
      .then(() => this._setState({
        deletingCommentId: null,
        disabled: false
      }));
  }

  _setState(state) {
    this._state = Object.assign({}, this._state, state);
    this.update(this._movie);
  }

  _updateMovieRequest(movie) {
    this.disable(true);

    return this._api
      .updateMovie(movie)
      .then(() => this.disable(false));
  }

  _handleUpdateMovieRequestError(err) { // eslint-disable-line no-unused-vars
    //
  }

  _favoriteChangeHandler() {
    const newMovie = Object.assign({}, this._movie, {favorite: !this._movie.favorite});

    this._updateMovieRequest(newMovie)
      .then(() => this._changeCallback(newMovie))
      .catch(this._handleUpdateMovieRequestError);
  }

  _watchedChangeHandler() {
    const watched = !this._movie.watched;
    const watchingDate = watched ? new Date() : null;

    const newMovie = Object.assign({}, this._movie, {watched, watchingDate});

    this._updateMovieRequest(newMovie)
      .then(() => this._changeCallback(newMovie))
      .catch(this._handleUpdateMovieRequestError);
  }

  _watchlistChangeHandler() {
    const newMovie = Object.assign({}, this._movie, {watchlist: !this._movie.watchlist});

    this._updateMovieRequest(newMovie)
      .then(() => this._changeCallback(newMovie))
      .catch(this._handleUpdateMovieRequestError);
  }

  /**
   * Возвращает состояние попапа: активен или скрыт
   * @return {boolean} активен ли попап
   */
  get active() {
    return Boolean(this._moviePopupVeiw);
  }

  setChangeHandler(callback) {
    this._changeCallback = callback;
  }

  setCloseHandler(callback) {
    this._closeCallback = callback;
  }

  disable(value) {
    this._setState({disabled: value});
  }

  close() {
    document.removeEventListener(`keydown`, this._escapeKeyDownHandler);
    this._newCommentView.dispose();
    this._moviePopupVeiw.destroy();
    this._moviePopupVeiw = null;
    this._closeCallback();
  }

  update(movie) {
    this._movie = movie;

    const disabled = this._state.disabled;
    const comments = movie.comments.map((commentId) => this._commentsModel.get(commentId));

    if (this._moviePopupVeiw) {
      this._controlsView.updateData(Object.assign({}, movie, {disabled}));
      this._commentsCountView.updateData({count: comments.length});
      this._newCommentView.updateData({disabled});

      this._moviePopupCommentsListView.updateData({
        comments,
        disabled,
        deletingId: this._state.deletingCommentId
      });

      if (this._state.disabled) {
        this._moviePopupVeiw.removeCloseHandler();
        document.removeEventListener(`keydown`, this._escapeKeyDownHandler);
      } else {
        this._moviePopupVeiw.setCloseHandler(this.close);
        document.addEventListener(`keydown`, this._escapeKeyDownHandler);
      }

      return;
    }

    document.addEventListener(`keydown`, this._escapeKeyDownHandler);

    this._moviePopupVeiw = new MoviePopupView(movie);
    this._moviePopupVeiw.setCloseHandler(this.close);

    const controlsData = {
      favorite: movie.favorite,
      watched: movie.watched,
      watchlist: movie.watchlist
    };

    this._controlsView = new MoviePopupControlsView(controlsData);
    this._controlsView.setWatchedChangeHandler(this._watchedChangeHandler);
    this._controlsView.setWatchlistChangeHandler(this._watchlistChangeHandler);
    this._controlsView.setFavoriteChangeHandler(this._favoriteChangeHandler);

    render(this._moviePopupVeiw.getElement().querySelector(`.form-details__top-container`),
        this._controlsView, RenderPosition.BEFOREEND);

    const commentsContainer = this._moviePopupVeiw.getElement().querySelector(`.film-details__comments-wrap`);

    this._commentsCountView = new MoviePopupCommentsCountView({count: movie.comments.length});
    render(commentsContainer, this._commentsCountView, RenderPosition.AFTERBEGIN);

    this._moviePopupCommentsListView = new MoviePopupCommentsListView({comments}, this._deleteCommentHandler);
    render(commentsContainer, this._moviePopupCommentsListView, RenderPosition.BEFOREEND);

    this._newCommentView = new MoviePopupNewCommentView();
    this._newCommentView.setAddCommentHandler(this._commentAddHandler);
    render(commentsContainer, this._newCommentView, RenderPosition.BEFOREEND);

    render(this._container, this._moviePopupVeiw, RenderPosition.BEFOREEND);
  }
}
