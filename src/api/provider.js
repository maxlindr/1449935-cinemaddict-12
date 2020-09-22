import MoviesModel from '../models/movies-model.js';
import CommentsModel from '../models/comments-model.js';

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, moviesStore, commentsStore) {
    this._api = api;
    this._moviesStore = moviesStore;
    this._commentsStore = commentsStore;

    this._dirtyMovies = [];
  }

  get dirty() {
    return this._dirtyMovies.length > 0;
  }

  getMovies() {
    if (Provider.isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._moviesStore.setItems(items);
          return movies;
        });
    }

    const storeMovies = Object.values(this._moviesStore.getItems());

    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  getComments(movieId) {
    if (Provider.isOnline()) {
      return this._api.getComments(movieId)
        .then((comments) => {
          const items = createStoreStructure(comments.map(CommentsModel.adaptToServer));
          this._commentsStore.addItems(items);
          return comments;
        });
    }

    const storeComments = Object.values(this._commentsStore.getItems());
    const movie = this._moviesStore.getItems()[movieId];

    const movieComments = movie.comments.reduce((acc, currentId) => {
      const currentComment = storeComments.find((comment) => comment.id === currentId);
      return [...acc, currentComment];
    }, []);

    return Promise.resolve(movieComments.map(CommentsModel.adaptToClient));
  }

  updateMovie(movie) {
    if (Provider.isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._moviesStore.setItem(updatedMovie.id, updatedMovie);
          return updatedMovie;
        });
    }

    this._moviesStore.setItem(movie.id, MoviesModel.adaptToServer(movie));
    this._dirtyMovies.push(movie);

    return Promise.resolve(movie);
  }

  addComment(movieId, comment) {
    if (!Provider.isOnline()) {
      return Promise.reject(`Can't add comments in offline mode`);
    }

    return this._api.addComment(movieId, comment)
      .then(({movie, comments}) => {
        const items = createStoreStructure(comments.map(CommentsModel.adaptToServer));
        this._commentsStore.setItems(items);
        return {movie, comments};
      });
  }

  deleteComment(id) {
    if (!Provider.isOnline()) {
      return Promise.reject(`Can't delete comments in offline mode`);
    }

    return this._api.deleteComment(id)
      .then(() => this._commentsStore.removeItem(id));
  }

  sync() {
    if (Provider.isOnline()) {
      return this._api.sync(this._dirtyMovies)
        .then((response) => {
          const items = createStoreStructure(response.updated);
          this._moviesStore.addItems(items);

          this._dirtyMovies = [];

          return Object.values(items)
            .map(MoviesModel.adaptToClient);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
