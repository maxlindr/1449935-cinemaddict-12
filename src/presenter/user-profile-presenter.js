import ProfileView from '../view/profile-view';
import {render, RenderPosition} from '../render.js';

export default class UserProfilePresenter {
  constructor(container, userProfileModel) {
    this._container = container;
    this._userProfileModel = userProfileModel;

    this._view = new ProfileView({
      avatarUrl: userProfileModel.getAvatar(),
      rank: ``
    });

    render(container, this._view, RenderPosition.BEFOREEND);
  }

  init() {
    this._userProfileModel.registerObserver((updateType, payload) => {
      this._view.updateData(payload);
    });
  }
}
