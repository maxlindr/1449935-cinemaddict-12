import Observable from '../observable';
import {UpdateType} from '../constants';

export default class MoviesModel extends Observable {
  constructor(movies = []) {
    super();
    this._movies = movies.slice();
  }

  static adaptToClient(movie) {
    /* eslint-disable camelcase */
    const {film_info, user_details, comments} = movie;
    const {alternative_title, title, poster, age_rating, director, writers, actors, release, description, runtime, genre} = film_info;
    const {watchlist, already_watched, watching_date, favorite} = user_details;

    return Object.assign(
        {},
        {
          id: movie.id,
          title: alternative_title,
          originalTitle: title,
          poster,
          rating: age_rating,
          director,
          writers,
          cast: actors,
          releaseDate: new Date(release.date),
          duration: runtime,
          country: release.release_country,
          genres: genre,
          description,
          ageRating: age_rating,
          comments,
          watched: already_watched,
          favorite,
          watchlist,
          watchingDate: new Date(watching_date)
        }
    );
  }

  static adaptToServer(movie) {
    throw new Error('Not Implemented');
  }

  get(id) {
    return this._movies.find((movie) => movie.id === id);
  }

  getAll() {
    return this._movies.slice();
  }

  set(movies) {
    this._movies = movies.slice();
    this._notify(UpdateType.COLLECTION, this._movies.slice());
  }

  updateMovie(movie, updateType) {
    const index = this._movies.findIndex((item) => item.id === movie.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }

    this._movies.splice(index, 1, movie);

    this._notify(updateType, movie);
  }
}
