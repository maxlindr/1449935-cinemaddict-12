import AbstractView from './abstract-view';

const createTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`
  );
};

export default class NoMoviesView extends AbstractView {
  getTemplate() {
    return createTemplate();
  }
}
