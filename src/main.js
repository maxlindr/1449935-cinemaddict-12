import {createMainMenuTemplate} from './view/main-menu';
import {createMoviesSortBarTemplate} from './view/movies-sort-bar';
import {createMoviesContainerTemplate} from './view/movies-container';
import {createAllMoviesBoardTemplate} from './view/all-movies-board';
import {createProfileTemplate} from './view/profile';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createMovieCardTemplate} from './view/movie-card';
import {createMoviesExtraBoard} from './view/movies-extra-board';
import {createStatsElement} from './view/stats';
// import {createMovieDetailsPopup} from './view/movie-detail-popup';

const ALL_MOVIES_BOARD_CARDS_COUNT = 5;
const EXTRA_BOARDS_MOVIES_CARDS_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector(`.header`);
render(header, createProfileTemplate(`Movie Buff`, `images/bitmap@2x.png`), `beforeend`);

const main = document.querySelector(`.main`);
render(main, createMainMenuTemplate(), `beforeend`);
render(main, createMoviesSortBarTemplate(), `beforeend`);
render(main, createMoviesContainerTemplate(), `beforeend`);

const moviesContainer = document.querySelector(`.films`);
render(moviesContainer, createAllMoviesBoardTemplate(), `beforeend`);

// All movies board
const allMoviesBoard = document.querySelector(`.films-list`);
const allMovieCardsContainer = allMoviesBoard.querySelector(`.films-list__container`);
for (let i = 0; i < ALL_MOVIES_BOARD_CARDS_COUNT; i++) {
  render(allMovieCardsContainer, createMovieCardTemplate(), `beforeend`);
}
render(allMoviesBoard, createShowMoreButtonTemplate(), `beforeend`);

// Top rated board
render(moviesContainer, createMoviesExtraBoard(`Top rated`), `beforeend`);
const topRatedBoard = moviesContainer.querySelectorAll(`.films-list--extra`)[0];
const topRatedList = topRatedBoard.querySelector(`.films-list__container`);
for (let i = 0; i < EXTRA_BOARDS_MOVIES_CARDS_COUNT; i++) {
  render(topRatedList, createMovieCardTemplate(), `beforeend`);
}

// Most commented board
render(moviesContainer, createMoviesExtraBoard(`Most commented`), `beforeend`);
const mostCommentedBoard = moviesContainer.querySelectorAll(`.films-list--extra`)[1];
const mostCommentedList = mostCommentedBoard.querySelector(`.films-list__container`);
for (let i = 0; i < EXTRA_BOARDS_MOVIES_CARDS_COUNT; i++) {
  render(mostCommentedList, createMovieCardTemplate(), `beforeend`);
}

const statsContainer = document.querySelector(`.footer__statistics`);
render(statsContainer, createStatsElement(`130 291`), `beforeend`);
