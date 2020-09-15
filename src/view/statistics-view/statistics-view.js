import SmartView from '../abstract/smart-view';
import {calcUserRank} from '../../utils';
import {StatsInterval} from '../../constants';
import {drawChart} from './statistics-chart';

/**
 * Сортирует жанры по количеству фильмов
 * @param {Array} movies
 * @return {Array<{genre: String, moviesCount: Number}>} массив объектов
 */
const distributeGenresByMoviesCount = (movies) => {
  const genresMovieMap = new Map();

  const uniqueGenres = new Set(movies.map((movie) => movie.genres).flat());
  uniqueGenres.forEach((genre) => genresMovieMap.set(genre, []));
  movies.forEach((movie) => movie.genres.forEach((genre) => genresMovieMap.get(genre).push(movie)));

  return Array.from(genresMovieMap.entries())
    .map(([genre, genreMovies]) => ({genre, moviesCount: genreMovies.length}))
    .sort((a, b) => b.moviesCount - a.moviesCount);
};

export default class StatisticsView extends SmartView {
  constructor(data, statsIntervalChangeCallback = () => {}) {
    super(data);

    this.statsIntervalChangeCallback = statsIntervalChangeCallback;
    this._statsIntervalChangeHandler = this._statsIntervalChangeHandler.bind(this);
  }

  _restoreHandlers() {
    this.getElement().querySelectorAll(`.statistic__filters-input`)
      .forEach((input) => input.addEventListener(`change`, this._statsIntervalChangeHandler));
  }

  _statsIntervalChangeHandler(evt) {
    evt.preventDefault();
    this.statsIntervalChangeCallback(evt.target.value);
  }

  updateData(data) {
    super.updateData(data);
    const statisticCtx = document.querySelector(`.statistic__chart`);
    drawChart(statisticCtx, distributeGenresByMoviesCount(data.movies));
  }

  getTemplate() {
    const {user, filter, movies} = this._data;

    const totalDuration = movies.reduce((acc, movie) => (acc += movie.duration), 0);
    const totalDurationWholeHours = Math.floor(totalDuration / 60);
    const totalDurationMinutes = totalDuration % 60;

    const genresByMoviesCountDistribution = distributeGenresByMoviesCount(movies);
    const topGenre = genresByMoviesCountDistribution[0] ? genresByMoviesCountDistribution[0].genre : ``;

    return (`<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="${user.avatar}" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${calcUserRank(user.rating)}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${filter === StatsInterval.ALL_TIME ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${filter === StatsInterval.TODAY ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${filter === StatsInterval.WEEK ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${filter === StatsInterval.MONTH ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${filter === StatsInterval.YEAR ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${movies.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDurationWholeHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`);
  }
}
