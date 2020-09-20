/**
 * Итератор, выдающий элементы исходного массива группами, заданной размерности
 */
export default class ArrayChunkIterator {
  /**
   * @param {*} arr исходный массив
   * @param {number} chunkSize максимальная размерность массива, выдаваемого за одну итерацию
   */
  constructor(arr = [], chunkSize = 1) {
    this._arr = arr;
    this._chunkSize = chunkSize;
    this._counter = 0;
  }

  /**
   * Возвращает группу элементов исходного массива
   * @return {array}
   */
  next() {
    if (!this.hasNext()) {
      throw new RangeError(`Out of range`);
    }

    const arr = this._arr.slice(this._counter, this._counter + this._chunkSize);
    this._counter += arr.length;

    return arr;
  }

  /**
   * Остались ли элементы в итераторе
   * @return {Boolean} true если остались элементы
   */
  hasNext() {
    return this._counter < this._arr.length;
  }
}
