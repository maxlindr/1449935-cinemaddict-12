import {generateRandomIntegerFromRange} from './random-integer';

const getRandomArrayElementsRecurcive = (arr, number, result = []) => {
  if (arr.length === 0 || !number) {
    return result;
  }
  const index = generateRandomIntegerFromRange(0, arr.length - 1);
  const newElements = arr.splice(index, 1);
  return getRandomArrayElementsRecurcive(arr, --number, result.concat(newElements));
};

export const getRandomArrayElements = (arr, number) => {
  const newArr = Array.from(arr);
  return getRandomArrayElementsRecurcive(newArr, number, []);
};
