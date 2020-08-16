import {generateRandomIntegerFromRange, getRandomArrayElement, generateName} from './mock-utils';

const EMOJIES = [
  `angry`,
  `puke`,
  `sleeping`,
  `smile`,
];

const MESSAGES = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`
];

export const generateComment = (earliestDate) => {
  const latestDateMillis = Date.now();
  const earliestDateMillis = earliestDate.getTime();
  const commentDateMillis = generateRandomIntegerFromRange(earliestDateMillis, latestDateMillis);

  return {
    emoji: getRandomArrayElement(EMOJIES),
    message: getRandomArrayElement(MESSAGES),
    author: generateName(),
    date: new Date(commentDateMillis)
  };
};
