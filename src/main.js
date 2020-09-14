import MainMenuPresenter from './presenter/main-menu-presenter';
import ProfileView from './view/profile';
import StatisticsPresenter from './presenter/statistics-presenter';
import StatsView from './view/stats-view';
import {createMovieMock} from './mock/movie-mock';
import MovieList from './presenter/movie-list';
import {createUserProfileMock} from './mock/user-profile-mock';
import {render, RenderPosition} from './render.js';
import MoviesModel from './models/movies-model';
import CommentsModel from './models/comments-model';
import {BoardMode} from './constants';
import FiltersModel from './models/filters-model';
import {UpdateType} from './constants';

const MOVIES_COUNT = 20;

let movies = Array(MOVIES_COUNT).fill().map(createMovieMock);
const comments = movies.reduce((acc, current) => acc.concat(current.comments), []);

movies = movies.map((movie) => {
  return Object.assign({}, movie, {comments: movie.comments.map((comment) => comment.id)});
});

const commentsModel = new CommentsModel(comments);

// const movies = [];
const moviesModel = new MoviesModel(movies);
const userProfile = createUserProfileMock();

const header = document.querySelector(`.header`);
render(header, new ProfileView(userProfile.rating, userProfile.avatar), RenderPosition.BEFOREEND);

const main = document.querySelector(`.main`);

const filtersModel = new FiltersModel();
const mainMenuPresenter = new MainMenuPresenter(main, filtersModel, moviesModel);
const statisticsPresenter = new StatisticsPresenter(main, moviesModel);
const movieBoard = new MovieList(main, filtersModel, moviesModel, commentsModel);

let statisticsClickHandler;
let filterClickHandler;

statisticsClickHandler = () => {
  movieBoard.hide();
  statisticsPresenter.init(userProfile, moviesModel);
  mainMenuPresenter.setFilterClickHandler(filterClickHandler);
  mainMenuPresenter.removeStatsClickHandler();
};

filterClickHandler = (filter) => {
  statisticsPresenter.destroy();
  movieBoard.init(filter);
  mainMenuPresenter.setStatsClickHandler(statisticsClickHandler);
  mainMenuPresenter.removeFilterClickHandler();
};

movieBoard.init(BoardMode.ALL);
mainMenuPresenter.setStatsClickHandler(statisticsClickHandler);

const statsContainer = document.querySelector(`.footer__statistics`);
render(statsContainer, new StatsView(moviesModel.getAll().length), RenderPosition.BEFOREEND);

commentsModel.registerObserver((eventType, payload) => {
  const oldMovie = moviesModel.get(payload.movieId);
  let newMovie;

  if (eventType === CommentsModel.EVENT_DELETE) {
    newMovie = Object.assign({}, oldMovie, {comments: oldMovie.comments.filter((id) => id !== payload.commentId)});
    moviesModel.updateMovie(newMovie, UpdateType.ITEM);
  } else {
    newMovie = Object.assign({}, oldMovie, {comments: [...oldMovie.comments, payload.comment.id]});
  }

  moviesModel.updateMovie(newMovie, UpdateType.ITEM);
});
