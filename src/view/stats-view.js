import SmartView from './abstract/smart-view';

export default class StatsView extends SmartView {
  _restoreHandlers() {}

  getTemplate() {
    return `${this._data.moviesCount} movies inside`;
  }
}
