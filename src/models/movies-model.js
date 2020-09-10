import Observable from '../observable';

export default class MoviesModel extends Observable {
  constructor(movies = []) {
    super();
    this._movies = movies.slice();
  }

  get() {
    return this._movies.slice();
  }

  set(movies) {
    this._movies = movies.slice();
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
