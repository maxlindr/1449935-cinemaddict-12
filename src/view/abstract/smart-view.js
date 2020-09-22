import AbstractView from "./abstract-view";

export default class SmartView extends AbstractView {
  constructor(stateData = {}) {
    super();
    this._data = stateData;
  }

  updateData(update, onlyDataUpdating) {
    if (!update) {
      return;
    }

    const isShouldElementUpdate = this._shouldElementUpdate(update);
    this._data = Object.assign({}, this._data, update);

    if (onlyDataUpdating) {
      return;
    }

    if (isShouldElementUpdate) {
      this.updateElement();
    }
  }

  getElement() {
    if (this._element) {
      return this._element;
    }

    super.getElement();
    this._restoreHandlers();
    return this._element;
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;
  }

  _shouldElementUpdate(stateData) {
    for (const [key, prop] of Object.entries(stateData)) {
      if (prop !== this._data[key]) {
        return true;
      }
    }

    return false;
  }

  _restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
