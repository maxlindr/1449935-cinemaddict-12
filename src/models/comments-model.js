import Observable from '../observable';
import {generateId} from '../mock/mock-utils';

export default class CommentsModel extends Observable {
  constructor(comments = []) {
    super();

    this._comments = comments.slice();
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
    const newComment = Object.assign({}, comment, {id: generateId()});
    this._comments.push(newComment);

    this._notify(CommentsModel.EVENT_ADD, {
      movieId,
      comment: newComment
    });
  }
}

CommentsModel.EVENT_DELETE = `delete`;
CommentsModel.EVENT_ADD = `add`;
