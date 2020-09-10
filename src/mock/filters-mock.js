export const createFilters = (moviesModel) => {
  const movies = moviesModel.get();

  return {
    all: () => movies,
    watchlist: () => movies.filter((movie) => movie.watchlist),
    history: () => movies.filter((movie) => movie.watched),
    favorites: () => movies.filter((movie) => movie.favorite),
  };
};
