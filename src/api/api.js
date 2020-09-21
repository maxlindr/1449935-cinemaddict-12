import CommentsModel from '../models/comments-model';
import MoviesModel from '../models/movies-model';

const toJSON = (response) => response.json();

const checkStatus = (response) => {
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response;
};

const catchError = (err) => {
  throw err;
};

export default class Api {
  constructor(endPoint, authCredentials) {
    this._endPoint = endPoint;
    this._authCredentials = authCredentials;
  }

  _send({
    url,
    method = `GET`,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authCredentials);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(checkStatus)
      .catch(catchError);
  }

  addComment(movieId, comment) {
    return this._send({
      url: `comments/${movieId}`,
      method: `POST`,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(toJSON);
  }

  deleteComment(id) {
    return this._send({
      url: `comments/${id}`,
      method: `DELETE`
    });
  }

  getMovies() {
    return this._send({url: `movies`})
      .then(toJSON)
      .then((movies) => movies.map(MoviesModel.adaptToClient));
  }

  getComments(movieId) {
    return this._send({url: `comments/${movieId}`})
      .then(toJSON)
      .then((comment) => comment.map(CommentsModel.adaptToClient));
  }

  sync(data) {
    return this._send({
      url: `movies/sync`,
      method: `POST`,
      body: JSON.stringify(data.map(MoviesModel.adaptToServer)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(toJSON);
  }

  updateMovie(movie) {
    return this._send({
      url: `movies/${movie.id}`,
      method: `PUT`,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(toJSON);
  }
}
