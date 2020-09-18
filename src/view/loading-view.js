import AbstractView from './abstract/abstract-view';

const createTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>`
  );
};

export default class LoadingView extends AbstractView {
  getTemplate() {
    return createTemplate();
  }
}
