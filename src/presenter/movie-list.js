import MoviesContainerView from '../view/movies-container';
import AllMoviesBoardView from '../view/all-movies-board';
import ShowMoreButtonView from '../view/show-more-button';
import MovieCardView from '../view/movie-card';
import MoviesExtraBoardView from '../view/movies-extra-board';
import MovieDetailsPopupView from '../view/movie-detail-popup';
import NoMoviesView from '../view/no-movies';
import {render, RenderPosition} from '../render.js';
import ArrayChunkIterator from '../array-chunk-iterator';

const ALL_MOVIES_BOARD_CARDS_PORTION_COUNT = 5;
const EXTRA_BOARDS_MOVIES_CARDS_COUNT = 2;

const body = document.querySelector(`body`);

const appendMovieToContainer = (container, movie) => {
  const movieCardView = new MovieCardView(movie);

  const cardElementClickHandler = (evt) => {
    evt.preventDefault();

    const movieDetailsPopupView = new MovieDetailsPopupView(movie);
    const movieDetailsPopupElement = movieDetailsPopupView.getElement();

    let disposePopup;

    const escapeKeyDownHandler = (escDownEvt) => {
      if (escDownEvt.key === `Escape`) {
        disposePopup();
      }
    };

    disposePopup = () => {
      document.removeEventListener(`keydown`, escapeKeyDownHandler);
      body.removeChild(movieDetailsPopupElement);
    };

    movieDetailsPopupView.setCloseHandler(disposePopup);
    document.addEventListener(`keydown`, escapeKeyDownHandler);

    body.appendChild(movieDetailsPopupElement);
  };

  movieCardView.setClickHandler(cardElementClickHandler);

  container.append(movieCardView);
};

export default class MovieList {
  constructor(container) {
    this._container = container;
    this._boardsContainerView = new MoviesContainerView();
    this._noMoviesView = new NoMoviesView();
    this._allMoviesBoardView = new AllMoviesBoardView();
    this._showMoreBtnView = new ShowMoreButtonView();
    this._topRatedBoard = new MoviesExtraBoardView(`Top rated`);
    this._mostCommentedBoard = new MoviesExtraBoardView(`Most commented`);
  }

  init(movies) {
    this._movies = movies;

    render(this._container, this._boardsContainerView, RenderPosition.BEFOREEND);

    if (movies.length > 0) {
      this._renderAllMoviesBoard();
      this._renderTopRatedBoard();
      this._renderMostCommentedBoard();
    } else {
      render(this._boardsContainerView, this._noMoviesView, RenderPosition.BEFOREEND);
    }
  }

  _renderAllMoviesBoard() {
    render(this._boardsContainerView, this._allMoviesBoardView, RenderPosition.BEFOREEND);

    this._movieChunksIterator = new ArrayChunkIterator(this._movies, ALL_MOVIES_BOARD_CARDS_PORTION_COUNT);
    this._movieChunksIterator.next().forEach((movie) => appendMovieToContainer(this._allMoviesBoardView, movie));

    if (!this._movieChunksIterator.isDone) {
      this._renderShowMoreBtnView();
    }
  }

  _renderShowMoreBtnView() {
    render(this._allMoviesBoardView, this._showMoreBtnView, RenderPosition.BEFOREEND);

    this._showMoreBtnView.setClickHandler(() => {
      this._movieChunksIterator.next().forEach((movie) => appendMovieToContainer(this._allMoviesBoardView, movie));

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
      appendMovieToContainer(this._topRatedBoard, topRatedMovies[i]);
    }
  }

  _renderMostCommentedBoard() {
    const mostCommentedMovies = this._movies.slice().sort((a, b) => b.comments.length - a.comments.length);

    render(this._boardsContainerView, this._mostCommentedBoard, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(mostCommentedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
      appendMovieToContainer(this._mostCommentedBoard, mostCommentedMovies[i]);
    }
  }
}
