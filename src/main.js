import MainMenuPresenter from './presenter/main-menu-presenter';
import UserProfileModel from './models/user-profile-model';
import UserProfilePresenter from './presenter/user-profile-presenter';
import StatisticsPresenter from './presenter/statistics-presenter';
import StatsView from './view/stats-view';
import MovieList from './presenter/movie-list';
import {render, RenderPosition} from './render.js';
import MoviesModel from './models/movies-model';
import CommentsModel from './models/comments-model';
import {BoardMode} from './constants';
import FiltersModel from './models/filters-model';
import {UpdateType} from './constants';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const MOVIES_STORE_NAME = `${STORE_PREFIX}-movies-${STORE_VER}`;
const COMMENTS_STORE_NAME = `${STORE_PREFIX}-comments-${STORE_VER}`;

const AUTH_CREDENTIALS = `Basic lkjdfzlkdf746G6kl`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTH_CREDENTIALS);

const moviesStore = new Store(MOVIES_STORE_NAME, window.localStorage);
const commentsStore = new Store(COMMENTS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, moviesStore, commentsStore);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const userProfileModel = new UserProfileModel(moviesModel);

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

new UserProfilePresenter(header, userProfileModel); // eslint-disable-line no-new

const filtersModel = new FiltersModel();
const mainMenuPresenter = new MainMenuPresenter(main, filtersModel, moviesModel);
const statisticsPresenter = new StatisticsPresenter(main, moviesModel, userProfileModel);
const movieBoard = new MovieList(main, filtersModel, moviesModel, commentsModel, apiWithProvider);

const statisticsClickHandler = () => {
  movieBoard.destroy();
  statisticsPresenter.init();
  mainMenuPresenter.setFilterClickHandler(filterClickHandler);
  mainMenuPresenter.removeStatsClickHandler();
};

const filterClickHandler = (filter) => {
  statisticsPresenter.destroy();
  movieBoard.init(filter);
  mainMenuPresenter.setStatsClickHandler(statisticsClickHandler);
  mainMenuPresenter.removeFilterClickHandler();
};

movieBoard.init(BoardMode.ALL);
mainMenuPresenter.setStatsClickHandler(statisticsClickHandler);

const statsContainer = document.querySelector(`.footer__statistics`);
const shortStatsView = new StatsView();
render(statsContainer, shortStatsView, RenderPosition.BEFOREEND);
moviesModel.registerObserver((updateType) => {
  if (updateType !== UpdateType.ITEM) {
    shortStatsView.updateData({moviesCount: moviesModel.getAll().length});
  }
});

apiWithProvider.getMovies()
  .then((movies) => {
    const resolveMovieComments = (movie) => apiWithProvider.getComments(movie.id);

    return Promise
      .all(movies.map(resolveMovieComments))
      .then((comments) => ({comments: comments.flat(), movies}));
  })
  .then(({comments, movies}) => {
    commentsModel.setAll(comments);
    moviesModel.set(movies, UpdateType.INIT);
  })
  .catch(() => moviesModel.set([], UpdateType.INIT));

commentsModel.registerObserver((eventType, payload) => {
  const oldMovie = moviesModel.get(payload.movieId);
  let newMovie;

  if (eventType === CommentsModel.EVENT_DELETE) {
    const comments = oldMovie.comments.filter((id) => id !== payload.commentId);
    newMovie = Object.assign({}, oldMovie, {comments});
  } else {
    const comments = [...oldMovie.comments, payload.comment.id];
    newMovie = Object.assign({}, oldMovie, {comments});
  }

  moviesModel.updateMovie(newMovie, UpdateType.ITEM);
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/service-worker.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (apiWithProvider.dirty) {
    apiWithProvider.sync()
      .then((updatedMovies) => {
        updatedMovies.forEach((movie) => {
          moviesModel.updateMovie(movie, UpdateType.COLLECTION);
        });
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
