import MovieControlsView from '../abstract/movie-controls-vew';

const BUTTON_ACTIVE_CLASSNAME = `film-card__controls-item--active`;

export default class MovieCardControlsView extends MovieControlsView {
  getTemplate() {
    const disabledAttribute = this._data.disabled ? `disabled` : ``;

    return (
      `<form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${this._data.watchlist ? ` ` + BUTTON_ACTIVE_CLASSNAME : ``}" ${disabledAttribute}>Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${this._data.watched ? ` ` + BUTTON_ACTIVE_CLASSNAME : ``}" ${disabledAttribute}>Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite${this._data.favorite ? ` ` + BUTTON_ACTIVE_CLASSNAME : ``}" ${disabledAttribute}>Mark as favorite</button>
      </form>`
    );
  }

  _restoreHandlers() {
    const element = this.getElement();

    element.querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, this._watchedClickHandler);

    element.querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, this._watchlistClickHandler);

    element.querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }
}
