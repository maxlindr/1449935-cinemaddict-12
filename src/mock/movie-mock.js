import {generateRandomIntegerFromRange} from './mock-utils';

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

const getRandomArrayElement = (arr) => arr[generateRandomIntegerFromRange(0, arr.length - 1)];

const getRandomArrayElements = (() => {
  const getRandomArrayElementsRecurcive = (arr, number, result = []) => {
    if (arr.length === 0 || !number) {
      return result;
    }
    const index = generateRandomIntegerFromRange(0, arr.length - 1);
    const newElements = arr.splice(index, 1);
    return getRandomArrayElementsRecurcive(arr, --number, result.concat(newElements));
  };

  return (arr, number) => {
    const newArr = Array.from(arr);
    return getRandomArrayElementsRecurcive(newArr, number, []);
  };
})();

const generateRandomRating = () => Number((Math.random() * 10).toFixed(1));

const generateName = (() => {
  const FULL_NAMES = [
    `Guy Ritchie`,
    `Jerome Robbins`,
    `George Romero`,
    `Mark Sandrich`,
    `Frank Scheffer`,
    `Alex Segal`,
    `Francis Stokes`,
    `Josh Trank`,
    `Shinya Tsukamoto`,
    `Jacques Tati`,
    `Steven Spielberg`,
    `Andrew Stanton`,
    `Jim Sheridan`,
    `Ginny Stikeman`,
    `Sean Penn`,
    `Ulrike Ottinger`,
    `Stan Moore`,
    `Elaine May`,
    `Barbara Loden`,
    `Jennifer Lee`,
    `Billy Wilder`,
    `Robert Towne`,
    `Quentin Tarantino`,
    `William Goldman`,
    `Charlie Kaufman`,
    `Woody Allen`,
    `Nora Ephron`,
    `Ernest Lehman`,
    `Paul Schrader`,
    `Oliver Stone`,
    `Aaron Sorkin`,
    `Paddy Chayefsky`,
    `Spike Lee`,
    `George Lucas`,
    `Preston Sturges`,
    `Stanley Kubrick`,
    `Paul Anderson`,
    `Frances Marion`
  ];

  const names = [];
  const surnames = [];

  FULL_NAMES.forEach((fullName) => {
    const parts = fullName.split(` `);
    names.push(parts[0]);
    surnames.push(parts[1]);
  });

  const maxIndex = names.length - 1;

  return () => {
    const name = names[generateRandomIntegerFromRange(0, maxIndex)];
    const surname = surnames[generateRandomIntegerFromRange(0, maxIndex)];
    return `${name} ${surname}`;
  };
})();

const generateNames = (number) => Array(number).fill().map(generateName);

const generateRandomDate = () => {
  const currDate = new Date();
  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth();

  const dayOfMonth = generateRandomIntegerFromRange(1, 31);
  const month = generateRandomIntegerFromRange(0, currMonth);
  const year = generateRandomIntegerFromRange(1900, currYear);
  return new Date(year, month - 1, dayOfMonth);
};

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

const generateDescription = (() => {
  const SENTENCES_MAX_COUNT = 5;
  const RAW_TEXT_SOURCE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  const sentences = RAW_TEXT_SOURCE
    .split(`.`)
    .map((sentence) => sentence.trim())
    .filter((str) => str);
  const desiredSentencesCount = generateRandomIntegerFromRange(1, SENTENCES_MAX_COUNT);

  return () => getRandomArrayElements(sentences, desiredSentencesCount).join(`. `) + `.`;
})();

const generateComment = (() => {
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

  return (earliestDate) => {
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
})();

const generateComments = (count, earliestDate) => {
  const comments = Array(count).fill().map(() => generateComment(earliestDate));
  comments.sort((a, b) => a.date.getTime() - b.date.getTime());
  return comments;
};

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

class ArrayCyclicIterator {
  constructor(arr) {
    this._arr = Array.from(arr);
    this._counter = new CyclicCounter(arr.length);
  }

  next() {
    return this._arr[this._counter.next()];
  }
}

const titlesCyclicIterator = new ArrayCyclicIterator(TITLES);

export const createMovieMock = () => {
  const WRITERS_MAX_COUNT = 2;
  const ACTORS_MAX_COUNT = 10;
  const COMMENTS_MAX_COUNT = 5;
  const title = titlesCyclicIterator.next();
  const writersCount = generateRandomIntegerFromRange(1, WRITERS_MAX_COUNT);
  const actorsCount = generateRandomIntegerFromRange(5, ACTORS_MAX_COUNT);
  const genresCount = generateRandomIntegerFromRange(1, GENRES.length);
  const commentsCount = generateRandomIntegerFromRange(0, COMMENTS_MAX_COUNT);
  const releaseDate = generateRandomDate();
  const watched = Boolean(generateRandomIntegerFromRange(0, 1));

  return {
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
    ageRating: generateRandomIntegerFromRange(0, 18) + `+`,
    comments: generateComments(commentsCount, releaseDate),
    watched,
    favorite: Boolean(generateRandomIntegerFromRange(0, 1)),
    watchlist: watched ? false : Boolean(generateRandomIntegerFromRange(0, 1)),
  };
};
