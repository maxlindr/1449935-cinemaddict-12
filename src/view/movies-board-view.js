import AbstractView from './abstract/abstract-view';
import {render, RenderPosition} from '../render.js';

export default class MoviesBoardView extends AbstractView {
  getMoviesContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }

  append(card) {
    render(this.getMoviesContainer(), card, RenderPosition.BEFOREEND);
  }
}
