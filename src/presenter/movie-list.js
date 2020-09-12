import MoviesSortBarView from '../view/movies-sort-bar-view';
import MoviesContainerView from '../view/movies-container';
import AllMoviesBoardView from '../view/all-movies-board';
import ShowMoreButtonView from '../view/show-more-button';
import MoviesExtraBoardView from '../view/movies-extra-board';
import MoviePopupPresenter from './movie-popup-presenter';
import MovieCardPresenter from './movie-card-presenter';
import NoMoviesView from '../view/no-movies';
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
  constructor(container, filtersModel, moviesModel) {
    this._container = container;
    this._filtersModel = filtersModel;
    this._moviesModel = moviesModel;

    this._activePopup = null;

    this._moviePopupPresentersMap = new Map();
    this._generalMoviePresentersMap = new Map();
    this._topRatedMoviePresentersMap = new Map();
    this._mostCommentedMoviePresentersMap = new Map();

    this._moviesSortBarView = new MoviesSortBarView();
    this._boardsContainerView = new MoviesContainerView();
    this._noMoviesView = new NoMoviesView();
    this._allMoviesBoardView = new AllMoviesBoardView();
    this._showMoreBtnView = new ShowMoreButtonView();
    this._topRatedBoard = new MoviesExtraBoardView(`Top rated`);
    this._mostCommentedBoard = new MoviesExtraBoardView(`Most commented`);

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._updateMovie = this._updateMovie.bind(this);

    this._sortType = SortType.DEFAULT;
    this._boardMode = BoardMode.ALL;

    this._moviesModel.registerObserver(this._modelEventHandler);

    this._filtersModel.registerObserver((event, data) => {
      this._boardMode = data;
      this._clearAllMoviesBoard();
      this._renderAllMovies();
    });
  }

  init(boardMode) {
    this._boardMode = boardMode;

    render(this._container, this._moviesSortBarView, RenderPosition.BEFOREEND);
    render(this._container, this._boardsContainerView, RenderPosition.BEFOREEND);

    if (this._moviesModel.get().length > 0) {
      this._renderAllMoviesBoard();
      this._renderTopRatedBoard();
      this._renderMostCommentedBoard();
      this._moviesSortBarView.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    } else {
      render(this._boardsContainerView, this._noMoviesView, RenderPosition.BEFOREEND);
    }
  }

  _appendMovieToContainer(container, movie) {
    const cardElementClickHandler = () => {
      if (this._activePopup) {
        this._activePopup.close();
      }

      const movieData = this._moviesModel.get().find((mov) => mov.id === movie.id);
      let moviePopup = this._moviePopupPresentersMap.get(movie.id);

      if (moviePopup) {
        moviePopup.update(movieData);
      } else {
        moviePopup = new MoviePopupPresenter(body, movieData);
        moviePopup.setChangeHandler(this._viewActionHandler);
        this._moviePopupPresentersMap.set(movie.id, moviePopup);

        moviePopup.setCloseHandler(() => {
          this._activePopup = null;
        });
      }

      this._activePopup = moviePopup;
    };

    const movieCard = new MovieCardPresenter(container, movie);
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

  _modelEventHandler(updateType, data) {
    if (updateType === UpdateType.ITEM) {
      this._updateMovie(data);
      this._clearMostCommentedBoard();
      this._renderMostCommentedMovies();
    } else {
      this._updateMovie(data);
      this._clearAllMoviesBoard();
      this._renderAllMovies();
    }
  }

  _viewActionHandler(movie) {
    const oldMovie = this._moviesModel.get().find((item) => item.id === movie.id);

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
    this._movieChunksIterator.next().forEach((movie) => this._appendMovieToContainer(this._allMoviesBoardView, movie));

    if (!this._movieChunksIterator.isDone) {
      this._renderShowMoreBtnView();
    }
  }

  _renderShowMoreBtnView() {
    render(this._allMoviesBoardView, this._showMoreBtnView, RenderPosition.BEFOREEND);

    this._showMoreBtnView.setClickHandler(() => {
      this._movieChunksIterator.next().forEach((movie) => this._appendMovieToContainer(this._allMoviesBoardView, movie));

      if (this._movieChunksIterator.isDone) {
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
    const topRatedMovies = this._moviesModel.get().sort((a, b) => b.rating - a.rating);

    for (let i = 0; i < Math.min(topRatedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
      this._appendMovieToContainer(this._topRatedBoard, topRatedMovies[i]);
    }
  }

  _renderMostCommentedBoard() {
    render(this._boardsContainerView, this._mostCommentedBoard, RenderPosition.BEFOREEND);
    this._renderMostCommentedMovies();
  }

  _renderMostCommentedMovies() {
    const mostCommentedMovies = this._moviesModel.get().sort((a, b) => b.comments.length - a.comments.length);

    for (let i = 0; i < Math.min(mostCommentedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
      this._appendMovieToContainer(this._mostCommentedBoard, mostCommentedMovies[i]);
    }
  }

  _getFilteredMovies() {
    const filter = this._filtersModel.get();
    return filter(this._moviesModel.get());
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
    this._allMoviesBoardView.getMoviesContainer().textContent = ``;
    this._generalMoviePresentersMap.clear();
    this._showMoreBtnView.destroy();
  }

  _clearMostCommentedBoard() {
    this._mostCommentedBoard.getMoviesContainer().textContent = ``;
    this._mostCommentedMoviePresentersMap.clear();
  }

  _clearTopRatedBoard() {
    this._topRatedBoard.getMoviesContainer().textContent = ``;
    this._topRatedMoviePresentersMap.clear();
  }

  _clearPopups() {
    if (this._activePopup) {
      this._activePopup.close();
      this._activePopup = null;
    }

    this._moviePopupPresentersMap.clear();
  }

  _updateMovie(data) {
    const movieId = data.id;

    const moviePopup = this._moviePopupPresentersMap.get(movieId);
    if (moviePopup && moviePopup.active) {
      moviePopup.update(data);
    }

    const generalMovie = this._generalMoviePresentersMap.get(movieId);
    if (generalMovie) {
      generalMovie.update(data);
    }

    const topRatedMovie = this._topRatedMoviePresentersMap.get(movieId);
    if (topRatedMovie) {
      topRatedMovie.update(data);
    }

    const mostCommentedMovie = this._mostCommentedMoviePresentersMap.get(movieId);
    if (mostCommentedMovie) {
      mostCommentedMovie.update(data);
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
}
