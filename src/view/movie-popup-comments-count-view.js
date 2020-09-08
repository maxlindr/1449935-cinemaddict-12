import SmartView from './abstract/smart-view';

export default class MoviePopupCommentsCountView extends SmartView {
  _restoreHandlers() {}

  getTemplate() {
    return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._data.count}</span></h3>`;
  }
}
