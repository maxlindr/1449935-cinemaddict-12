const MINUTES_IN_HOUR = 60;

/**
 * Конвертирует заданное число минут в строку вида '<часы>h <минуты>m'
 * @param {number} duration длительность в минутах
 */
const formatDuration = (duration) => {
  const hoursPart = Math.floor(duration / MINUTES_IN_HOUR);
  const minutesPart = duration % MINUTES_IN_HOUR;

  return `${hoursPart}h ${minutesPart}m`;
};

export {formatDuration};
