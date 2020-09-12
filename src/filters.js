import {BoardMode} from './constants';

export const filters = {
  [BoardMode.ALL]: (movies) => movies,
  [BoardMode.WATCHLIST]: (movies) => movies.filter((movie) => movie.watchlist),
  [BoardMode.HISTORY]: (movies) => movies.filter((movie) => movie.watched),
  [BoardMode.FAVORITES]: (movies) => movies.filter((movie) => movie.favorite),
};
