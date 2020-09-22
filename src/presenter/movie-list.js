import MoviesSortBarView from '../view/movies-sort-bar-view';
import MoviesContainerView from '../view/movies-container';
import AllMoviesBoardView from '../view/all-movies-board';
import ShowMoreButtonView from '../view/show-more-button';
import MoviesExtraBoardView from '../view/movies-extra-board';
import MoviePopupPresenter from './movie-popup-presenter';
import MovieCardPresenter from './movie-card-presenter';
import NoMoviesView from '../view/no-movies';
import LoadingView from '../view/loading-view';
import {render, RenderPosition} from '../render.js';
import ArrayChunkIterator from '../array-chunk-iterator';
import {SortType, UpdateType, BoardMode} from '../constants';

const ALL_MOVIES_BOARD_CARDS_PORTION_COUNT = 5;
const EXTRA_BOARDS_MOVIES_CARDS_COUNT = 2;

const body = document.querySelector(`body`);

/**
 * Проверяет имеется ли разница в следующих свойствах сравниваемых фильмов: favorite, watched, watchlist
 * @param {*} movie1 первый сравниваемый фильм
 * @param {*} movie2 второй сравниваемый фильм
 * @return {boolean} отличаются ли статусы фильмов
 */
const testMovieStatusChanged = (movie1, movie2) => {
  return (
    movie1.favorite !== movie2.favorite ||
    movie1.watched !== movie2.watched ||
    movie1.watchlist !== movie2.watchlist
  );
};

export default class MovieList {
  constructor(container, filtersModel, moviesModel, commentsModel, api) {
    this._container = container;
    this._filtersModel = filtersModel;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._api = api;

    this._activePopup = null;

    this._moviePopupPresentersMap = new Map();
    this._generalMoviePresentersMap = new Map();
    this._topRatedMoviePresentersMap = new Map();
    this._mostCommentedMoviePresentersMap = new Map();

    this._moviesSortBarView = new MoviesSortBarView();
    this._boardsContainerView = new MoviesContainerView();
    this._noMoviesView = new NoMoviesView();
    this._loadingView = new LoadingView();
    this._allMoviesBoardView = new AllMoviesBoardView();
    this._showMoreBtnView = new ShowMoreButtonView();
    this._topRatedBoard = new MoviesExtraBoardView(`Top rated`);
    this._mostCommentedBoard = new MoviesExtraBoardView(`Most commented`);

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._updateMovie = this._updateMovie.bind(this);

    this._sortType = SortType.DEFAULT;
    this._boardMode = BoardMode.ALL;
    this._isLoading = true;

    this._moviesSortBarView.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  init(boardMode) {
    this._boardMode = boardMode;
    this._sortType = SortType.DEFAULT;

    render(this._container, this._moviesSortBarView, RenderPosition.BEFOREEND);
    render(this._container, this._boardsContainerView, RenderPosition.BEFOREEND);

    if (this._isLoading) {
      render(this._boardsContainerView, this._loadingView, RenderPosition.BEFOREEND);
    } else {
      this._renderBoard();
    }

    this._moviesModel.registerObserver(this._modelEventHandler);
    this._filtersModel.registerObserver(this._filterChangeHandler);
  }

  _appendMovieToContainer(container, movie) {
    const cardElementClickHandler = () => {
      if (this._activePopup) {
        this._activePopup.close();
      }

      const movieData = this._moviesModel.get(movie.id);
      let moviePopup = this._moviePopupPresentersMap.get(movie.id);

      if (moviePopup) {
        moviePopup.update(movieData);
      } else {
        moviePopup = new MoviePopupPresenter(body, movieData, this._commentsModel, this._api);
        moviePopup.setChangeHandler(this._viewActionHandler);
        this._moviePopupPresentersMap.set(movie.id, moviePopup);

        moviePopup.setCloseHandler(() => {
          this._activePopup = null;
        });
      }

      this._activePopup = moviePopup;
    };

    const movieCard = new MovieCardPresenter(container, movie, this._api);
    movieCard.setClickHandler(cardElementClickHandler);
    movieCard.setChangeHandler(this._viewActionHandler);

    switch (container) {
      case this._topRatedBoard:
        this._topRatedMoviePresentersMap.set(movie.id, movieCard);
        break;
      case this._mostCommentedBoard:
        this._mostCommentedMoviePresentersMap.set(movie.id, movieCard);
        break;
      default:
        this._generalMoviePresentersMap.set(movie.id, movieCard);
        break;
    }
  }

  _filterChangeHandler(event) {
    if (this._boardMode === event) {
      return;
    }

    this._moviesSortBarView.updateData({sortType: SortType.DEFAULT});
    this._sortType = SortType.DEFAULT;

    this._boardMode = event;
    this._clearAllMoviesBoard();
    this._renderAllMovies();
  }

  _modelEventHandler(updateType, updatedMovie) {
    this._isLoading = false;

    if (updateType === UpdateType.INIT) {
      this._loadingView.destroy();
      this._renderBoard();
    } else if (updateType === UpdateType.ITEM) {
      this._updateMovie(updatedMovie);
      this._clearMostCommentedBoard();
      this._renderMostCommentedMovies();
    } else {
      this._updateMovie(updatedMovie);
      this._clearAllMoviesBoard();
      this._clearMostCommentedBoard();
      this._clearTopRatedBoard();
      this._renderAllMovies();
      this._renderTopRatedMovies();
      this._renderMostCommentedMovies();
    }
  }

  _viewActionHandler(movie) {
    const oldMovie = this._moviesModel.get(movie.id);

    const updateType = (this._boardMode === BoardMode.ALL || !testMovieStatusChanged(movie, oldMovie))
      ? UpdateType.ITEM
      : UpdateType.COLLECTION;

    this._moviesModel.updateMovie(movie, updateType);
  }

  _renderAllMoviesBoard() {
    render(this._boardsContainerView, this._allMoviesBoardView, RenderPosition.BEFOREEND);
    this._renderAllMovies();
  }

  _renderAllMovies() {
    this._movieChunksIterator = new ArrayChunkIterator(this._getGeneralBoardMovies(), ALL_MOVIES_BOARD_CARDS_PORTION_COUNT);

    if (!this._movieChunksIterator.hasNext()) {
      return;
    }

    this._movieChunksIterator.next().forEach((movie) => this._appendMovieToContainer(this._allMoviesBoardView, movie));

    if (this._movieChunksIterator.hasNext()) {
      this._renderShowMoreBtnView();
    }
  }

  _resetBoard() {
    this._filtersModel.unregisterObserver(this._filterChangeHandler);
    this._moviesModel.unregisterObserver(this._modelEventHandler);

    this._boardsContainerView.destroy();
    this._moviesSortBarView.destroy();

    this._allMoviesBoardView.destroy();
    this._topRatedBoard.destroy();
    this._mostCommentedBoard.destroy();
  }

  _renderBoard() {
    this._moviesSortBarView.updateData({sortType: this._sortType});

    if (this._moviesModel.getAll().length > 0) {
      this._renderAllMoviesBoard();
      this._renderTopRatedBoard();
      this._renderMostCommentedBoard();
    } else {
      render(this._boardsContainerView, this._noMoviesView, RenderPosition.BEFOREEND);
    }
  }

  _renderShowMoreBtnView() {
    render(this._allMoviesBoardView, this._showMoreBtnView, RenderPosition.BEFOREEND);

    this._showMoreBtnView.setClickHandler(() => {
      this._movieChunksIterator.next().forEach((movie) => this._appendMovieToContainer(this._allMoviesBoardView, movie));

      if (!this._movieChunksIterator.hasNext()) {
        this._showMoreBtnView.removeClickHandler();
        this._showMoreBtnView.getElement().remove();
      }
    });
  }

  _renderTopRatedBoard() {
    render(this._boardsContainerView, this._topRatedBoard, RenderPosition.BEFOREEND);
    this._renderTopRatedMovies();
  }

  _renderTopRatedMovies() {
    const topRatedMovies = this._moviesModel.getAll().sort((a, b) => b.rating - a.rating);

    for (let i = 0; i < Math.min(topRatedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
      this._appendMovieToContainer(this._topRatedBoard, topRatedMovies[i]);
    }
  }

  _renderMostCommentedBoard() {
    render(this._boardsContainerView, this._mostCommentedBoard, RenderPosition.BEFOREEND);
    this._renderMostCommentedMovies();
  }

  _renderMostCommentedMovies() {
    const mostCommentedMovies = this._moviesModel.getAll().sort((a, b) => b.comments.length - a.comments.length);

    for (let i = 0; i < Math.min(mostCommentedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
      this._appendMovieToContainer(this._mostCommentedBoard, mostCommentedMovies[i]);
    }
  }

  _getFilteredMovies() {
    const filter = this._filtersModel.get();
    return filter(this._moviesModel.getAll());
  }

  _getGeneralBoardMovies() {
    switch (this._sortType) {
      case SortType.DATE:
        return this._getFilteredMovies().sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
      case SortType.RATING:
        return this._getFilteredMovies().sort((a, b) => b.rating - a.rating);
      default:
        return this._getFilteredMovies();
    }
  }

  _sortTypeChangeHandler(sortType) {
    if (sortType === this._sortType) {
      return;
    }

    this._moviesSortBarView.updateData({sortType});
    this._sortType = sortType;
    this._clearAllMoviesBoard();
    this._renderAllMovies();
  }

  _clearAllMoviesBoard() {
    Array.from(this._generalMoviePresentersMap.values()).forEach((presenter) => presenter.destroy());
    this._generalMoviePresentersMap.clear();
    this._showMoreBtnView.destroy();
  }

  _clearMostCommentedBoard() {
    Array.from(this._mostCommentedMoviePresentersMap.values()).forEach((presenter) => presenter.destroy());
    this._mostCommentedMoviePresentersMap.clear();
  }

  _clearTopRatedBoard() {
    Array.from(this._topRatedMoviePresentersMap.values()).forEach((presenter) => presenter.destroy());
    this._topRatedMoviePresentersMap.clear();
  }

  _clearPopups() {
    if (this._activePopup) {
      this._activePopup.close();
      this._activePopup = null;
    }

    this._moviePopupPresentersMap.clear();
  }

  _updateMovie(movie) {
    const movieId = movie.id;

    const moviePopup = this._moviePopupPresentersMap.get(movieId);
    if (moviePopup && moviePopup.active) {
      moviePopup.update(movie);
    }

    const generalMovie = this._generalMoviePresentersMap.get(movieId);
    if (generalMovie) {
      generalMovie.update(movie);
    }

    const topRatedMovie = this._topRatedMoviePresentersMap.get(movieId);
    if (topRatedMovie) {
      topRatedMovie.update(movie);
    }

    const mostCommentedMovie = this._mostCommentedMoviePresentersMap.get(movieId);
    if (mostCommentedMovie) {
      mostCommentedMovie.update(movie);
    }
  }

  setBoardMode(boardMode) {
    if (this._boardMode === boardMode) {
      return;
    }

    this._boardMode = boardMode;

    this._clearAllMoviesBoard();
    this._renderAllMovies();
  }

  destroy() {
    this._filtersModel.unregisterObserver(this._filterChangeHandler);
    this._moviesModel.unregisterObserver(this._modelEventHandler);

    this._clearAllMoviesBoard();
    this._clearTopRatedBoard();
    this._clearMostCommentedBoard();

    this._allMoviesBoardView.destroy();
    this._topRatedBoard.destroy();
    this._mostCommentedBoard.destroy();

    this._moviesSortBarView.destroy();
    this._boardsContainerView.destroy();
  }
}
