import AbstractView from './abstract-view';
import {render, RenderPosition} from '../render.js';

export default class MoviesBoardView extends AbstractView {
  constructor() {
    super();
    this._element = null;
  }

  getMoviesContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }

  append(card) {
    render(this.getMoviesContainer(), card, RenderPosition.BEFOREEND);
  }
}
