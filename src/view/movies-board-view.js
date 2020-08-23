import AbstractView from './abstract-view';
import {render, RenderPosition} from '../render.js';

export default class MoviesBoardView extends AbstractView {
  constructor() {
    super();
  }

  getMoviesContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }

  append(card) {
    render(this.getMoviesContainer(), card, RenderPosition.BEFOREEND);
  }
}
