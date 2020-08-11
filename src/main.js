import {createMainMenuTemplate} from './view/main-menu';
import {createMoviesSortBarTemplate} from './view/movies-sort-bar';
import {createMoviesContainerTemplate} from './view/movies-container';
import {createAllMoviesBoardTemplate} from './view/all-movies-board';
import {createProfileTemplate} from './view/profile';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createMovieCardTemplate} from './view/movie-card';
import {createMoviesExtraBoard} from './view/movies-extra-board';
import {createStatsElement} from './view/stats';
import {createMovieDetailsPopup} from './view/movie-detail-popup';
import {createMovieMock} from './mock/movie-mock';
import {createUserProfileMock} from './mock/user-profile-mock';
import {createFilters} from './mock/filters-mock';

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

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector(`.header`);
render(header, createProfileTemplate(userProfile.rating, userProfile.avatar), `beforeend`);

const main = document.querySelector(`.main`);
render(main, createMainMenuTemplate(createFilters(movies)), `beforeend`);
render(main, createMoviesSortBarTemplate(), `beforeend`);
render(main, createMoviesContainerTemplate(), `beforeend`);

const moviesContainer = document.querySelector(`.films`);
render(moviesContainer, createAllMoviesBoardTemplate(), `beforeend`);

// All movies board
const allMoviesBoard = document.querySelector(`.films-list`);
const allMovieCardsContainer = allMoviesBoard.querySelector(`.films-list__container`);
const renderMovieToAllMoviesCardsContainer =
  (movie) => render(allMovieCardsContainer, createMovieCardTemplate(movie), `beforeend`);

const moviesIterator = new ArrayChunkIterator(movies, ALL_MOVIES_BOARD_CARDS_PORTION_COUNT);
moviesIterator.next().forEach(renderMovieToAllMoviesCardsContainer);
if (!moviesIterator.isDone) {
  render(allMoviesBoard, createShowMoreButtonTemplate(), `beforeend`);
  const showMoreBtn = document.querySelector(`.films-list__show-more`);
  showMoreBtn.addEventListener(`click`, () => {
    moviesIterator.next().forEach(renderMovieToAllMoviesCardsContainer);
    if (moviesIterator.isDone) {
      showMoreBtn.remove();
    }
  });
}

// Top rated board
render(moviesContainer, createMoviesExtraBoard(`Top rated`), `beforeend`);
const topRatedBoard = moviesContainer.querySelectorAll(`.films-list--extra`)[0];
const topRatedList = topRatedBoard.querySelector(`.films-list__container`);
const topRatedMovies = Array.from(movies).sort((a, b) => b.rating - a.rating);
for (let i = 0; i < Math.min(topRatedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
  render(topRatedList, createMovieCardTemplate(topRatedMovies[i]), `beforeend`);
}

// Most commented board
render(moviesContainer, createMoviesExtraBoard(`Most commented`), `beforeend`);
const mostCommentedBoard = moviesContainer.querySelectorAll(`.films-list--extra`)[1];
const mostCommentedList = mostCommentedBoard.querySelector(`.films-list__container`);
const mostCommentedMovies = Array.from(movies).sort((a, b) => b.comments.length - a.comments.length);
for (let i = 0; i < Math.min(mostCommentedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
  render(mostCommentedList, createMovieCardTemplate(mostCommentedMovies[i]), `beforeend`);
}

const statsContainer = document.querySelector(`.footer__statistics`);
render(statsContainer, createStatsElement(movies.length), `beforeend`);

// Movie details popup
const footer = document.querySelector(`.footer`);
render(footer, createMovieDetailsPopup(movies[0]), `afterend`);
