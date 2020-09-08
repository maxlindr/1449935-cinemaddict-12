import MovieControlsView from './abstract/movie-controls-vew';

export default class MoviePopupControlsView extends MovieControlsView {
  _restoreHandlers() {
    const element = this.getElement();

    element.querySelector(`#watched`).addEventListener(`change`, this._watchedClickHandler);
    element.querySelector(`#watchlist`).addEventListener(`change`, this._watchlistClickHandler);
    element.querySelector(`#favorite`).addEventListener(`change`, this._favoriteClickHandler);
  }

  getTemplate() {
    return (
      `<section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._data.watchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._data.watched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._data.favorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>`
    );
  }
}
