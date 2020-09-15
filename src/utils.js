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
  const durationObj = moment.duration(duration, `minutes`);
  return `${durationObj.hours()}h ${durationObj.minutes()}m`;
};

export const calcUserRank = (rating) => {
  if (rating === 0) {
    return ``;
  }

  if (rating <= 10) {
    return `novice`;
  }

  if (rating <= 20) {
    return `fan`;
  }

  return `movie buff`;
};
