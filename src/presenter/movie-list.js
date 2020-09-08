import MoviesSortBarView from '../view/movies-sort-bar';
import MoviesContainerView from '../view/movies-container';
import AllMoviesBoardView from '../view/all-movies-board';
import ShowMoreButtonView from '../view/show-more-button';
import MoviesExtraBoardView from '../view/movies-extra-board';
import MoviePopup from './movie-popup';
import MovieCardPresenter from './movie-card-presenter';
import NoMoviesView from '../view/no-movies';
import {render, RenderPosition} from '../render.js';
import ArrayChunkIterator from '../array-chunk-iterator';
import {SortType} from '../constants';


const ALL_MOVIES_BOARD_CARDS_PORTION_COUNT = 5;
const EXTRA_BOARDS_MOVIES_CARDS_COUNT = 2;

const body = document.querySelector(`body`);

const updateArrayElement = (collection, element) => {
  const index = collection.findIndex((item) => item.id === element.id);

  if (index === -1) {
    return collection;
  }

  return [
    ...collection.slice(0, index),
    element,
    ...collection.slice(index + 1)
  ];
};

export default class MovieList {
  constructor(container) {
    this._container = container;
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
    this._updateMovie = this._updateMovie.bind(this);

    this._sortType = SortType.DEFAULT;

  }

  init(movies) {
    this._movies = movies;
    this._sortedMovies = movies.slice();
    render(this._container, this._moviesSortBarView, RenderPosition.BEFOREEND);
    render(this._container, this._boardsContainerView, RenderPosition.BEFOREEND);

    if (movies.length > 0) {
      this._renderAllMoviesBoard();
      this._renderTopRatedBoard();
      this._renderMostCommentedBoard();
      this._moviesSortBarView.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    } else {
      render(this._boardsContainerView, this._noMoviesView, RenderPosition.BEFOREEND);
    }
  }

  _appendMovieToContainer(container, movie) {
    const cardElementClickHandler = (evt) => {
      evt.preventDefault();

      if (this._activePopup) {
        this._activePopup.close();
      }

      const movieData = this._movies.find((mov) => mov.id === movie.id);
      let moviePopup = this._moviePopupPresentersMap.get(movie.id);

      if (moviePopup) {
        moviePopup.update(movieData);
      } else {
        moviePopup = new MoviePopup(body, movieData);
        moviePopup.setChangeHandler(this._updateMovie);
        this._moviePopupPresentersMap.set(movie.id, moviePopup);

        moviePopup.setCloseHandler(() => {
          this._activePopup = null;
        });
      }

      this._activePopup = moviePopup;
    };

    const movieCard = new MovieCardPresenter(container, movie);
    movieCard.setClickHandler(cardElementClickHandler);
    movieCard.setChangeHandler(this._updateMovie);

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

  _renderAllMoviesBoard() {
    render(this._boardsContainerView, this._allMoviesBoardView, RenderPosition.BEFOREEND);
    this._renderAllMovies();
  }

  _renderAllMovies() {
    this._movieChunksIterator = new ArrayChunkIterator(this._sortedMovies, ALL_MOVIES_BOARD_CARDS_PORTION_COUNT);
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
    const topRatedMovies = this._movies.slice().sort((a, b) => b.rating - a.rating);

    render(this._boardsContainerView, this._topRatedBoard, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(topRatedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
      this._appendMovieToContainer(this._topRatedBoard, topRatedMovies[i]);
    }
  }

  _renderMostCommentedBoard() {
    const mostCommentedMovies = this._movies.slice().sort((a, b) => b.comments.length - a.comments.length);

    render(this._boardsContainerView, this._mostCommentedBoard, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(mostCommentedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
      this._appendMovieToContainer(this._mostCommentedBoard, mostCommentedMovies[i]);
    }
  }

  _sortMovies(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._sortedMovies.sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
        break;
      case SortType.RATING:
        this._sortedMovies.sort((a, b) => b.rating - a.rating);
        break;
      default:
        this._sortedMovies = this._movies.slice();
    }
  }

  _sortTypeChangeHandler(sortType) {
    if (sortType === this._sortType) {
      return;
    }

    this._sortType = sortType;
    this._sortMovies(sortType);
    this._clearAllMoviesBoard();
    this._renderAllMovies();
  }

  _clearAllMoviesBoard() {
    this._allMoviesBoardView.getMoviesContainer().textContent = ``;
    // todo: деактивируем все general презентеры
    this._generalMoviePresentersMap.clear();
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
    this._movies = updateArrayElement(this._movies, data);
    this._sortedMovies = updateArrayElement(this._sortedMovies, data);

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
}
