import Observable from '../observable';
import {BoardMode} from '../constants';
import {filters} from '../filters';

export default class FiltersModel extends Observable {
  constructor() {
    super();

    this._activeFilterName = BoardMode.ALL;
  }

  /**
   * Текущий фильтр
   * @return {function} текущая функция-фильтр
   */
  get() {
    return filters[this._activeFilterName];
  }

  setActive(filterName) {
    this._activeFilterName = filterName;
    this._notify(null, filters[this._activeFilterName]);
  }
}
