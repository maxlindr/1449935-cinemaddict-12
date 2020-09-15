import Observable from '../observable';

export default class CommentsModel extends Observable {
  constructor(comments = []) {
    super();

    this._comments = comments.slice();
  }

  static adaptToClient(dto) {
    const {id, author, comment, date, emotion} = dto;

    return {
      id,
      emoji: emotion,
      message: comment,
      author,
      date: new Date(date)
    };
  }

  static adaptToServer(movie) {
    throw new Error('Not Implemented');
  }

  get(id) {
    return this._comments.find((comment) => comment.id === id);
  }

  getAll() {
    return this._comments.slice();
  }

  delete(id, movieId) {
    const index = this._comments.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment ` + id);
    }

    this._comments.splice(index, 1);
    this._notify(CommentsModel.EVENT_DELETE, {movieId, commentId: id});
  }

  add(comment, movieId) {
    this._comments.push(comment);

    this._notify(CommentsModel.EVENT_ADD, {
      movieId,
      comment
    });
  }

  setAll(comments) {
    this._comments = comments.slice();
  }
}

CommentsModel.EVENT_DELETE = `delete`;
CommentsModel.EVENT_ADD = `add`;
