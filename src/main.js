import MainMenuView from './view/main-menu';
import ProfileView from './view/profile';
import StatsView from './view/stats';
import {createMovieMock} from './mock/movie-mock';
import MovieList from './presenter/movie-list';
import {createUserProfileMock} from './mock/user-profile-mock';
import {createFilters} from './mock/filters-mock';
import {render, RenderPosition} from './render.js';

const MOVIES_COUNT = 20;

const movies = Array(MOVIES_COUNT).fill().map(createMovieMock);
// const movies = [];
const userProfile = createUserProfileMock();

const header = document.querySelector(`.header`);
render(header, new ProfileView(userProfile.rating, userProfile.avatar), RenderPosition.BEFOREEND);

const main = document.querySelector(`.main`);
render(main, new MainMenuView(createFilters(movies)), RenderPosition.BEFOREEND);

const movieBoard = new MovieList(main);
movieBoard.init(movies);

const statsContainer = document.querySelector(`.footer__statistics`);
render(statsContainer, new StatsView(movies.length), RenderPosition.BEFOREEND);
