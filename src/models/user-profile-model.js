import Observable from '../observable';
import {filters} from '../filters';
import {BoardMode} from '../constants';

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

    this._moviesModel.registerObserver(() => {
      const watchedFilter = filters[BoardMode.HISTORY];
      const watchedMovies = watchedFilter(this._moviesModel.getAll());

      const oldRank = this._rank;
      this._rank = calcUserRank(watchedMovies.length);

      if (oldRank !== this._rank) {
        this._notify(null, {
          avatarUrl: AVATAR_URL,
          rank: this._rank
        });
      }
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
