import Observable from '../observable';
import {UpdateType} from '../constants';

export default class MoviesModel extends Observable {
  constructor(movies = []) {
    super();
    this._movies = movies.slice();
  }

  get(id) {
    return this._movies.find((movie) => movie.id === id);
  }

  getAll() {
    return this._movies.slice();
  }

  set(movies, updateType) {
    this._movies = movies.slice();
    this._notify(updateType || UpdateType.COLLECTION, this._movies.slice());
  }

  updateMovie(movie, updateType) {
    const index = this._movies.findIndex((item) => item.id === movie.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }

    this._movies.splice(index, 1, movie);

    this._notify(updateType, movie);
  }

  static adaptToClient(movie) {
    const {comments} = movie;
    const filmInfo = movie[`film_info`];
    const userDetails = movie[`user_details`];
    const {title, poster, director, writers, actors, release, description, runtime, genre} = filmInfo;
    const {watchlist, favorite} = userDetails;

    return Object.assign(
        {},
        {
          id: movie.id,
          title: filmInfo[`alternative_title`],
          originalTitle: title,
          poster,
          rating: filmInfo[`total_rating`],
          director,
          writers,
          cast: actors,
          releaseDate: new Date(release.date),
          duration: runtime,
          country: release.release_country,
          genres: genre,
          description,
          ageRating: filmInfo[`age_rating`],
          comments,
          watched: userDetails[`already_watched`],
          favorite,
          watchlist,
          watchingDate: new Date(userDetails[`watching_date`])
        }
    );
  }

  static adaptToServer(movie) {
    const {id, comments, originalTitle, title, poster, rating, director, writers, cast, releaseDate, duration, country,
      genres, description, ageRating, watched, favorite, watchlist, watchingDate} = movie;

    return {
      id,
      comments,
      [`film_info`]: {
        title: originalTitle,
        [`alternative_title`]: title,
        [`total_rating`]: rating,
        poster,
        [`age_rating`]: ageRating,
        director,
        writers,
        actors: cast,
        release: {
          date: releaseDate.toISOString(),
          [`release_country`]: country
        },
        runtime: duration,
        genre: genres,
        description
      },
      [`user_details`]: {
        watchlist,
        [`already_watched`]: watched,
        [`watching_date`]: watchingDate.toISOString(),
        favorite
      }
    };
  }
}
