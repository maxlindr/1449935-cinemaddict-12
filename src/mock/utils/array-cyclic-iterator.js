class CyclicCounter {
  constructor(max) {
    this._max = max;
    this._index = -1;
  }

  next() {
    this._index++;

    if (this._index >= this._max) {
      this._index = 0;
    }

    return this._index;
  }
}


export default class ArrayCyclicIterator {
  constructor(arr) {
    this._arr = Array.from(arr);
    this._counter = new CyclicCounter(arr.length);
  }

  next() {
    return this._arr[this._counter.next()];
  }
}
