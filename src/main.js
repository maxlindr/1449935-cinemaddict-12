import MainMenuView from './view/main-menu';
import ProfileView from './view/profile';
import StatsView from './view/stats';
import {createMovieMock} from './mock/movie-mock';
import MovieList from './presenter/movie-list';
import {createUserProfileMock} from './mock/user-profile-mock';
import {createFilters} from './mock/filters-mock';
import {render, RenderPosition} from './render.js';
import MoviesModel from './models/movies-model';
import {BoardMode} from './constants';

const MOVIES_COUNT = 20;

const movies = Array(MOVIES_COUNT).fill().map(createMovieMock);
// const movies = [];
const moviesModel = new MoviesModel(movies);
const userProfile = createUserProfileMock();

const header = document.querySelector(`.header`);
render(header, new ProfileView(userProfile.rating, userProfile.avatar), RenderPosition.BEFOREEND);

const main = document.querySelector(`.main`);
render(main, new MainMenuView(createFilters(moviesModel)), RenderPosition.BEFOREEND);

const movieBoard = new MovieList(main, moviesModel);
movieBoard.init(BoardMode.ALL);

const statsContainer = document.querySelector(`.footer__statistics`);
render(statsContainer, new StatsView(moviesModel.length), RenderPosition.BEFOREEND);
