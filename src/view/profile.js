import {createElement} from '../utils.js';

const calcRank = (rating) => {
  if (rating === 0) {
    return ``;
  } else if (rating <= 10) {
    return `novice`;
  } else if (rating <= 20) {
    return `fan`;
  }

  return `movie buff`;
};

const createProfileTemplate = (rating, avatarUrl) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${calcRank(rating)}</p>
      <img class="profile__avatar" src="${avatarUrl}" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileView {
  constructor(rating, avatarUrl) {
    this._rating = rating;
    this._avatarUrl = avatarUrl;
  }

  getTemplate() {
    return createProfileTemplate(this._rating, this._avatarUrl);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
