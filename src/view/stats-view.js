import AbstractView from './abstract/abstract-view';

const createStatsElement = (value) => {
  return `${value} movies inside`;
};

export default class StatsView extends AbstractView {
  constructor(value) {
    super();
    this._value = value;
  }

  getTemplate() {
    return createStatsElement(this._value);
  }
}