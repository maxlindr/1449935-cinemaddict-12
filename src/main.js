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
import {render, RenderPosition} from './utils.js';
import ArrayChunkIterator from './array-chunk-iterator';

const ALL_MOVIES_BOARD_CARDS_PORTION_COUNT = 5;
const EXTRA_BOARDS_MOVIES_CARDS_COUNT = 2;
const MOVIES_COUNT = 20;

const movies = Array(MOVIES_COUNT).fill().map(createMovieMock);
const userProfile = createUserProfileMock();

const body = document.querySelector(`body`);

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

const appendMovieToContainer = (container, movie) => {
  const movieCardView = new MovieCardView(movie);
  const movieCardElement = movieCardView.getElement();
  const cardPosterElement = movieCardElement.querySelector(`.film-card__poster`);
  const cardTitleElement = movieCardElement.querySelector(`.film-card__title`);
  const cardCommentsElement = movieCardElement.querySelector(`.film-card__comments`);

  const cardElementClickHandler = (evt) => {
    evt.preventDefault();

    const movieDetailsPopupView = new MovieDetailsPopupView(movie);
    const movieDetailsPopupElement = movieDetailsPopupView.getElement();
    const popupCloseBtn = movieDetailsPopupElement.querySelector(`.film-details__close-btn`);

    const removePopup = () => body.removeChild(movieDetailsPopupElement);

    const escapeKeyDownHandler = (escDownEvt) => {
      if (escDownEvt.key === `Escape`) {
        document.removeEventListener(`keydown`, escapeKeyDownHandler);
        removePopup();
      }
    };

    popupCloseBtn.addEventListener(`click`, removePopup);
    document.addEventListener(`keydown`, escapeKeyDownHandler);

    body.appendChild(movieDetailsPopupElement);
  };

  [cardPosterElement, cardTitleElement, cardCommentsElement].forEach((element) => {
    element.addEventListener(`click`, cardElementClickHandler);
  });

  render(container, movieCardElement, RenderPosition.BEFOREEND);
};

const moviesIterator = new ArrayChunkIterator(movies, ALL_MOVIES_BOARD_CARDS_PORTION_COUNT);
moviesIterator.next().forEach((movie) => appendMovieToContainer(allMovieCardsContainer, movie));

if (!moviesIterator.isDone) {
  const showMoreBtn = new ShowMoreButtonView().getElement();

  render(allMoviesBoard, showMoreBtn, RenderPosition.BEFOREEND);

  showMoreBtn.addEventListener(`click`, () => {
    moviesIterator.next().forEach((movie) => appendMovieToContainer(allMovieCardsContainer, movie));

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
  appendMovieToContainer(topRatedList, topRatedMovies[i]);
}

// Most commented board
const mostCommentedBoard = new MoviesExtraBoardView(`Most commented`).getElement();
render(moviesContainer, mostCommentedBoard, RenderPosition.BEFOREEND);
const mostCommentedList = mostCommentedBoard.querySelector(`.films-list__container`);
const mostCommentedMovies = Array.from(movies).sort((a, b) => b.comments.length - a.comments.length);
for (let i = 0; i < Math.min(mostCommentedMovies.length, EXTRA_BOARDS_MOVIES_CARDS_COUNT); i++) {
  appendMovieToContainer(mostCommentedList, mostCommentedMovies[i]);
}

const statsContainer = document.querySelector(`.footer__statistics`);
render(statsContainer, new StatsView(movies.length).getElement(), RenderPosition.BEFOREEND);
