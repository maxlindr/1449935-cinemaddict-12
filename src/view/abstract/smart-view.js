import AbstractView from "./abstract-view";

export default class SmartView extends AbstractView {
  constructor(data = {}) {
    super();
    this._data = data;
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

  _shouldElementUpdate(data) {
    for (const [key, prop] of Object.entries(data)) {
      if (prop !== this._data[key]) {
        return true;
      }
    }

    return false;
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
    if (this._beforeRemoved) {
      this._beforeRemoved();
    }

    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;
  }

  _restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
