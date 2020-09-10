export default class Observable {
  constructor() {
    this._observers = [];
  }

  registerObserver(observer) {
    this._observers.push(observer);
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }

  unregisterObserver(observer) {
    const index = this._observers.indexOf(observer);

    if (index !== -1) {
      this._observers.splice(index, 1);
    }
  }
}
