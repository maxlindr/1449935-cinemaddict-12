import SmartView from './abstract/smart-view';

export default class StatsView extends SmartView {
  constructor(stateData = {moviesCount: 0}) {
    super(stateData);
  }

  _restoreHandlers() {}

  getTemplate() {
    return `${this._data.moviesCount} movies inside`;
  }
}
