import MainMenuView from './view/main-menu';
import MoviesSortBarView from './view/movies-sort-bar';
import MoviesContainerView from './view/movies-container';
import AllMoviesBoardView from './view/all-movies-board';
import ProfileView from './view/profile';
import ShowMoreButtonView from './view/show-more-button';
import MovieCardView from './view/movie-card';
import MoviesExtraBoardView from './view/movies-extra-board';
import StatsView from './view/stats';
import MovieDetailsPopupView from './view/movie-detail-popup';
import {createMovieMock} from './mock/movie-mock';
import {createUserProfileMock} from './mock/user-profile-mock';
import {createFilters} from './mock/filters-mock';
import {render, RenderPosition} from "./utils.js";

const ALL_MOVIES_BOARD_CARDS_PORTION_COUNT = 5;
const EXTRA_BOARDS_MOVIES_CARDS_COUNT = 2;
const MOVIES_COUNT = 20;

/**
 * Итератор, выдающий элементы исходного массива группами, заданной размерности
 */
class ArrayChunkIterator {
  /**
   * @param {*} arr исходный массив
   * @param {number} chunkSize максимальная размерность массива, выдаваемого за одну итерацию
   */
  constructor(arr = [], chunkSize = 1) {
    this._arr = arr;
    this._chunkSize = chunkSize;
    this._counter = 0;
    this._isDone = arr.length === 0;
  }

  /**
   * Возвращает группу элементов исходного массива
   * @return {array}
   */
  next() {
    if (this._isDone) {
      throw new RangeError(`Out of range`);
    }

    const arr = this._arr.slice(this._counter, this._counter + this._chunkSize);
    this._counter += arr.length;

    if (this._counter >= this._arr.length) {
      this._isDone = true;
    }

    return arr;
  }

  /**
   * Признак того, что все элементы массива проитерированы
   */
  get isDone() {
    return this._isDone;
  }
}

const movies = Array(MOVIES_COUNT).fill().map(createMovieMock);
const userProfile = createUserProfileMock();

const header = document.querySelector(`.header`);
render(header, new ProfileView(userProfile.rating, userProfile.avatar).getElement(), RenderPosition.BEFOREEND);

const main = document.querySelector(`.main`);
render(main, new MainMenuView(createFilters(movies)).getElement(), RenderPosition.BEFOREEND);
render(main, new MoviesSortBarView().getElement(), RenderPosition.BEFOREEND);
const moviesContainer = new MoviesContainerView().getElement();
render(main, moviesContainer, RenderPosition.BEFOREEND);

// All movies board
const allMoviesBoard = new AllMoviesBoardView().getElement();
render(moviesContainer, allMoviesBoard, RenderPosition.BEFOREEND);
const allMovieCardsContainer = allMoviesBoard.querySelector(`.films-list__container`);
const renderMovieToAllMoviesCardsContainer =
  (movie) => render(allMovieCardsContainer, new MovieCardView(movie).getElement(), RenderPosition.BEFOREEND);

const moviesIterator = new ArrayChunkIterator(movies, ALL_MOVIES_BOARD_CARDS_PORTION_COUNT);
moviesIterator.next().forEach(renderMovieToAllMoviesCardsContainer);
if (!moviesIterator.isDone) {
  const showMoreBtn = new ShowMoreButtonView().getElement();
  render(allMoviesBoard, showMoreBtn, RenderPosition.BEFOREEND);
  showMoreBtn.addEventListener(`click`, () => {
    moviesIterator.next().forEach(renderMovieToAllMoviesCardsContainer);
    if (moviesIterator.isDone) {
      showMoreBtn.remove();
    }
  });
}

// Top rated board
const topRatedBoard = new MoviesExtraBoardView(`Top rated`).getElement();
render(moviesContainer, topRatedBoard, RenderPosition.BEFOREEND);
const topRatedList = topRatedBoard.querySelector(`.films-list__container`);
const topRatedMovies = Array.from(movies).sort((a, b) => b.rating - a.rating);
for (let i = 0; i < Math.min(topRatedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
  render(topRatedList, new MovieCardView(topRatedMovies[i]).getElement(), RenderPosition.BEFOREEND);
}

// Most commented board
const mostCommentedBoard = new MoviesExtraBoardView(`Most commented`).getElement();
render(moviesContainer, mostCommentedBoard, RenderPosition.BEFOREEND);
const mostCommentedList = mostCommentedBoard.querySelector(`.films-list__container`);
const mostCommentedMovies = Array.from(movies).sort((a, b) => b.comments.length - a.comments.length);
for (let i = 0; i < Math.min(mostCommentedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
  render(mostCommentedList, new MovieCardView(mostCommentedMovies[i]).getElement(), RenderPosition.BEFOREEND);
}

const statsContainer = document.querySelector(`.footer__statistics`);
render(statsContainer, new StatsView(movies.length).getElement(), RenderPosition.BEFOREEND);

// Movie details popup
const body = document.querySelector(`body`);
render(body, new MovieDetailsPopupView(movies[0]).getElement(), RenderPosition.BEFOREEND);
