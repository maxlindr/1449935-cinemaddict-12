import MainMenuPresenter from './presenter/main-menu-presenter';
import ProfileView from './view/profile';
import StatsView from './view/stats-view';
import {createMovieMock} from './mock/movie-mock';
import MovieList from './presenter/movie-list';
import {createUserProfileMock} from './mock/user-profile-mock';
import {render, RenderPosition} from './render.js';
import MoviesModel from './models/movies-model';
import {BoardMode} from './constants';
import FiltersModel from './models/filters-model';

const MOVIES_COUNT = 20;

const movies = Array(MOVIES_COUNT).fill().map(createMovieMock);
// const movies = [];
const moviesModel = new MoviesModel(movies);
const userProfile = createUserProfileMock();

const header = document.querySelector(`.header`);
render(header, new ProfileView(userProfile.rating, userProfile.avatar), RenderPosition.BEFOREEND);

const main = document.querySelector(`.main`);

const filtersModel = new FiltersModel();
const mainMenuPresenter = new MainMenuPresenter(main, filtersModel, moviesModel);
mainMenuPresenter.setStatsClickHandler(() => {});

const movieBoard = new MovieList(main, filtersModel, moviesModel);
movieBoard.init(BoardMode.ALL);

const statsContainer = document.querySelector(`.footer__statistics`);
render(statsContainer, new StatsView(moviesModel.get().length), RenderPosition.BEFOREEND);
