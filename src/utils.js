import moment from 'moment';

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
  const momentDuration = moment.duration(duration, `minutes`);
  return `${momentDuration.hours()}h ${momentDuration.minutes()}m`;
};
