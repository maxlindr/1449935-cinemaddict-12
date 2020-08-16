import {generateRandomIntegerFromRange} from './random-integer';

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

export const generateName = () => {
  const name = names[generateRandomIntegerFromRange(0, maxIndex)];
  const surname = surnames[generateRandomIntegerFromRange(0, maxIndex)];
  return `${name} ${surname}`;
};
