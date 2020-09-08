import MovieDetailsPopupView from '../view/movie-detail-popup';
import MoviePopupControlsView from '../view/movie-popup-controls-view';
import MoviePopupNewCommentView from '../view/movie-popup-new-comment-view';
import MoviePopupCommentsCountView from '../view/movie-popup-comments-count-view';
import MoviePopupCommentsListView from '../view/movie-popup-comments-list-view';
import {render, RenderPosition} from '../render.js';

export default class MoviePopup {
  constructor(container, movie) {
    this._container = container;

    this._escapeKeyDownHandler = this._escapeKeyDownHandler.bind(this);
    this._commentAddHandler = this._commentAddHandler.bind(this);
    this._watchedChangeHandler = this._watchedChangeHandler.bind(this);
    this._watchlistChangeHandler = this._watchlistChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);

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
      author: `Жорик`, // fixme:
      date: new Date()
    };

    this._changeCallback(Object.assign({}, this._movie, {comments: this._movie.comments.concat(newComment)}));
  }

  _favoriteChangeHandler() {
    this._changeCallback(Object.assign({}, this._movie, {favorite: !this._movie.favorite}));
  }

  _watchedChangeHandler() {
    this._changeCallback(Object.assign({}, this._movie, {watched: !this._movie.watched}));
  }

  _watchlistChangeHandler() {
    this._changeCallback(Object.assign({}, this._movie, {watchlist: !this._movie.watchlist}));
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

  close() {
    document.removeEventListener(`keydown`, this._escapeKeyDownHandler);
    this._container.removeChild(this._moviePopupVeiw.getElement());
    this._newCommentView.dispose();
    this._moviePopupVeiw = null;
    this._closeCallback();
  }

  update(movie) {
    this._movie = movie;

    if (this._moviePopupVeiw) {
      this._controlsView.updateData(movie);
      this._commentsCountView.updateData({count: movie.comments.length});
      this._moviePopupCommentsListView.updateData({comments: movie.comments});
      return;
    }

    document.addEventListener(`keydown`, this._escapeKeyDownHandler);

    this._moviePopupVeiw = new MovieDetailsPopupView(movie);
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

    this._moviePopupCommentsListView = new MoviePopupCommentsListView({comments: movie.comments});
    render(commentsContainer, this._moviePopupCommentsListView, RenderPosition.BEFOREEND);

    this._newCommentView = new MoviePopupNewCommentView();
    this._newCommentView.setAddCommentHandler(this._commentAddHandler);
    render(commentsContainer, this._newCommentView, RenderPosition.BEFOREEND);

    render(this._container, this._moviePopupVeiw, RenderPosition.BEFOREEND);
  }
}
