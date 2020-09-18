import {generateRandomIntegerFromRange, getRandomArrayElement, getRandomArrayElements, generateName, generateNames, generateId, ArrayCyclicIterator} from './mock-utils';
import {generateComment} from './generate-comment';
import {generateDescription} from './generate-description';

const WRITERS_MAX_COUNT = 2;
const ACTORS_MAX_COUNT = 10;
const COMMENTS_MAX_COUNT = 5;
const WATCHED_DATE_INTERVAL_MS = 1000 * 60 * 60 * 24 * 365;

const TITLES = [
  `Крёстный отец`,
  `Побег из Шоушенка `,
  `Список Шиндлера`,
  `Бешеный бык`,
  `Casablanca`,
  `Гражданин Кейн`,
  `Унесённые ветром`,
  `Волшебник страны Оз`,
  `Пролетая над гнездом кукушки`,
  `Лоуренс Аравийский`,
  `Головокружение`,
  `Психо`,
  `Крёстный отец 2`,
  `В порту`,
  `Sunset Blvd.`,
  `Форрест Гамп`,
  `Звуки музыки`,
  `12 рaзгневанных мужчин`,
  `West Side Story`,
  `Звёздные войны. Эпизод 4: Новая надежда`,
];

const POSTERS = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`,
];

const GENRES = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`
];

const COUNTRIES = [
  `Russia`,
  `Canada`,
  `China`,
  `United States`,
  `Brazil`,
  `Australia`,
  `India`,
  `Argentina`,
  `France`,
  `Spain`,
  `Japan`,
  `Italy`,
  `South Korea`,
  `Portugal`,
  `United Kingdom`
];

const generateRandomRating = () => Number((Math.random() * 10).toFixed(1));

const generateRandomDate = () => {
  const currDate = new Date();
  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth();

  const dayOfMonth = generateRandomIntegerFromRange(1, 31);
  const month = generateRandomIntegerFromRange(0, currMonth);
  const year = generateRandomIntegerFromRange(1900, currYear);
  return new Date(year, month - 1, dayOfMonth);
};

const generateComments = (count, earliestDate) => {
  const comments = Array(count).fill().map(() => generateComment(earliestDate));
  comments.sort((a, b) => a.date.getTime() - b.date.getTime());
  return comments;
};

const titlesCyclicIterator = new ArrayCyclicIterator(TITLES);

export const createMovieMock = () => {
  const title = titlesCyclicIterator.next();
  const writersCount = generateRandomIntegerFromRange(1, WRITERS_MAX_COUNT);
  const actorsCount = generateRandomIntegerFromRange(5, ACTORS_MAX_COUNT);
  const genresCount = generateRandomIntegerFromRange(1, GENRES.length);
  const commentsCount = generateRandomIntegerFromRange(0, COMMENTS_MAX_COUNT);
  const releaseDate = generateRandomDate();
  const watched = Boolean(generateRandomIntegerFromRange(0, 1));
  const dateNowMs = Date.now();

  return {
    id: generateId(),
    title,
    originalTitle: title,
    poster: getRandomArrayElement(POSTERS),
    rating: generateRandomRating(),
    director: generateName(),
    writers: generateNames(writersCount),
    cast: generateNames(actorsCount),
    releaseDate,
    duration: generateRandomIntegerFromRange(60, 120),
    country: getRandomArrayElement(COUNTRIES),
    genres: getRandomArrayElements(GENRES, genresCount),
    description: generateDescription(),
    ageRating: generateRandomIntegerFromRange(0, 18),
    comments: generateComments(commentsCount, releaseDate),
    watched,
    favorite: Boolean(generateRandomIntegerFromRange(0, 1)),
    watchlist: watched ? false : Boolean(generateRandomIntegerFromRange(0, 1)),
    watchingDate: new Date(generateRandomIntegerFromRange(dateNowMs - WATCHED_DATE_INTERVAL_MS, dateNowMs))
  };
};
