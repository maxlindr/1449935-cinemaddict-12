export const generateRandomIntegerFromRange = (lower = 0, upper = 1) => {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
};
