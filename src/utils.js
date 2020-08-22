const MINUTES_IN_HOUR = 60;

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * Конвертирует заданное число минут в строку вида '<часы>h <минуты>m'
 * @param {number} duration длительность в минутах
 * @return {string} Отформатированная строка
 */
export const formatDuration = (duration) => {
  const hoursPart = Math.floor(duration / MINUTES_IN_HOUR);
  const minutesPart = duration % MINUTES_IN_HOUR;

  return `${hoursPart}h ${minutesPart}m`;
};
