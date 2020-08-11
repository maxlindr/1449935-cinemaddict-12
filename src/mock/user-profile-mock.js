import {generateRandomIntegerFromRange} from './mock-utils';

const NO_RATING_LOWER = 0;
const NO_RATING_UPPER = 0;
const NOVICE_LOWER = 1;
const NOVICE_UPPER = 10;
const FAN_LOWER = 11;
const FAN_UPPER = 20;
const BUFF_LOWER = 21;
const BUFF_UPPER = Number.MAX_VALUE;

// Чтобы при вычислении звания пользователя у всех вариантов были равные вероятности,
// сначала понадобится выбрать случайный диапазон значений рейтинга, соответствующий определенному званию.
// Из этого диапазона будет выбираться случайное значение рейтинга.
const ratingRanges = [
  {
    lower: NO_RATING_LOWER,
    upper: NO_RATING_UPPER
  },
  {
    lower: NOVICE_LOWER,
    upper: NOVICE_UPPER
  },
  {
    lower: FAN_LOWER,
    upper: FAN_UPPER
  },
  {
    lower: BUFF_LOWER,
    upper: BUFF_UPPER
  },
];

export const createUserProfileMock = () => {
  const ratingRange = ratingRanges[generateRandomIntegerFromRange(0, ratingRanges.length - 1)];
  return {
    rating: generateRandomIntegerFromRange(ratingRange.lower, ratingRange.upper),
    avatar: `images/bitmap@2x.png`
  };
};
