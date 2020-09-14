import StatisticsView from '../view/statistics-view';
import {render, RenderPosition} from '../render.js';

export default class StatisticsPresenter {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._veiw = null;
  }

  destroy() {
    if (this._veiw) {
      this._veiw.getElement().remove();
      this._veiw = null;
    }
  }

  init() {
    if (!this._veiw) {
      this._veiw = new StatisticsView();
      render(this._container, this._veiw, RenderPosition.BEFOREEND);
      this._update();
      this._subscribeModels();
    }
  }

  _subscribeModels() {
    // todo:
    console.warn('_subscribeModels not implemented');
  }

  _update() {
    if (this._veiw) {
      this._veiw.updateData();
      return;
    }
  }
}
