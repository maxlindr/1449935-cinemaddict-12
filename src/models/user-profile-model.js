import Observable from '../observable';
import {UpdateType} from '../constants';

const calcUserRank = (rating) => {
  if (rating === 0) {
    return ``;
  }

  if (rating <= 10) {
    return `novice`;
  }

  if (rating <= 20) {
    return `fan`;
  }

  return `movie buff`;
};

const AVATAR_URL = `images/bitmap@2x.png`;

export default class UserProfileModel extends Observable {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;

    this._rank = ``;

    this._moviesModel.registerObserver((updateType) => {
      if (updateType === UpdateType.ITEM) {
        return;
      }

      this._rank = calcUserRank(this._moviesModel.getAll().length);

      this._notify(null, {
        avatarUrl: AVATAR_URL,
        rank: this._rank
      });
    });
  }

  getAvatar() {
    return AVATAR_URL;
  }

  getProfile() {
    return {
      avatarUrl: AVATAR_URL,
      rank: this._rank
    };
  }
}
