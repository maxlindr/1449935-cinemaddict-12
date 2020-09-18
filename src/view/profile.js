import SmartView from './abstract/smart-view';

export default class ProfileView extends SmartView {
  _restoreHandlers() {}

  getTemplate() {
    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${this._data.rank}</p>
        <img class="profile__avatar" src="${this._data.avatarUrl}" alt="Avatar" width="35" height="35">
      </section>`
    );
  }
}
