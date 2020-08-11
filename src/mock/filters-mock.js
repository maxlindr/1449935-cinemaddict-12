export const createFilters = (movies) => {
  return {
    all: movies.length,
    watchlist: movies.filter((movie) => movie.watchlist).length,
    history: movies.filter((movie) => movie.watched).length,
    favorites: movies.filter((movie) => movie.favorite).length,
  };
};
