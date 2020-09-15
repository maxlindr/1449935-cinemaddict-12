import AbstractView from './abstract/abstract-view';
import {calcUserRank} from '../utils';


const createProfileTemplate = (rating, avatarUrl) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${calcUserRank(rating)}</p>
      <img class="profile__avatar" src="${avatarUrl}" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileView extends AbstractView {
  constructor(rating, avatarUrl) {
    super();
    this._rating = rating;
    this._avatarUrl = avatarUrl;
  }

  getTemplate() {
    return createProfileTemplate(this._rating, this._avatarUrl);
  }
}
