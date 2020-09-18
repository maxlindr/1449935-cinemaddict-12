import Observable from '../observable';

const convertCommentsArrayToMap = (comments) => new Map(comments.map((comment) => [comment.id, comment]));

export default class CommentsModel extends Observable {
  constructor(comments = []) {
    super();

    this._comments = convertCommentsArrayToMap(comments);
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

  static adaptToServer(dto) {
    const {emoji, message, date} = dto;

    return {
      comment: message,
      date,
      emotion: emoji
    };
  }

  get(id) {
    return this._comments.get(id);
  }

  getAll() {
    return Array.from(this._comments.values());
  }

  delete(id, movieId) {
    if (!this._comments.has(id)) {
      throw new Error(`Can't delete unexisting comment ` + id);
    }

    this._comments.delete(id);
    this._notify(CommentsModel.EVENT_DELETE, {movieId, commentId: id});
  }

  add(comment, movieId) {
    let newComment;

    if (Array.isArray(comment)) {
      newComment = comment.find((item) => !this._comments.has(item.id));
      this._comments.set(newComment.id, newComment);
    } else {
      this._comments.set(comment.id, comment);
      newComment = comment;
    }

    this._notify(CommentsModel.EVENT_ADD, {
      movieId,
      comment: newComment
    });
  }

  setAll(comments) {
    this._comments = convertCommentsArrayToMap(comments);
  }
}

CommentsModel.EVENT_DELETE = `delete`;
CommentsModel.EVENT_ADD = `add`;
