import {generateRandomIntegerFromRange} from './utils/random-integer';
import {generateName} from './utils/generate-name';
import {getRandomArrayElements} from './utils/random-array-elements';
import ArrayCyclicIterator from './utils/array-cyclic-iterator';

const getRandomArrayElement = (arr) => arr[generateRandomIntegerFromRange(0, arr.length - 1)];

const generateNames = (number) => Array(number).fill().map(generateName);

export {generateRandomIntegerFromRange, generateName, generateNames, getRandomArrayElement, getRandomArrayElements, ArrayCyclicIterator};
