const EMOJIES_ANIMATION_START_TIMEOUT = 600;
const EMOJI_ANIMATION_TIME_OFFSET_STEP = 100;
const EMOJI_ANIMATION_DURATION = 300;
const EMOJI_ANIMATION_DURATION_IN_SEC = EMOJI_ANIMATION_DURATION / 1000;
const EMOJI_ANIMATION_ITERATION_COUNT = 2;
const TOTAL_ANIMATION_DURATION = EMOJI_ANIMATION_DURATION * EMOJI_ANIMATION_ITERATION_COUNT;
const EMOJI_ANIMATION_FINISH_FIX = 50;
const OPACITY_100_CLASSNAME = `opacity100`;

export const animateEmoji = (element, i, arr) => {
  // устанавливаем opacity 100%
  setTimeout(() => element.classList.add(OPACITY_100_CLASSNAME), EMOJIES_ANIMATION_START_TIMEOUT);

  const timeOffset = i * EMOJI_ANIMATION_TIME_OFFSET_STEP;

  // начало анимации
  setTimeout(() => {
    element.style.animation =
      `updown ${EMOJI_ANIMATION_DURATION_IN_SEC}s ease-in-out 0s ${EMOJI_ANIMATION_ITERATION_COUNT} normal none running`;
  }, EMOJIES_ANIMATION_START_TIMEOUT + timeOffset);

  // конец анимации
  setTimeout(() => (element.style.animation = ``),
      EMOJIES_ANIMATION_START_TIMEOUT + timeOffset + TOTAL_ANIMATION_DURATION);

  // возвращаем старое значение opacity
  const opacityRestoreTimeout =
    EMOJIES_ANIMATION_START_TIMEOUT +
    (arr.length - 1) * EMOJI_ANIMATION_TIME_OFFSET_STEP +
    TOTAL_ANIMATION_DURATION +
    EMOJI_ANIMATION_FINISH_FIX;

  setTimeout(() => element.classList.remove(OPACITY_100_CLASSNAME), opacityRestoreTimeout);
};
