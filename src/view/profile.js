const calcRank = (rating) => {
  if (rating === 0) {
    return ``;
  } else if (rating <= 10) {
    return `novice`;
  } else if (rating <= 20) {
    return `fan`;
  }

  return `movie buff`;
};

export const createProfileTemplate = (rating, avatarUrl) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${calcRank(rating)}</p>
      <img class="profile__avatar" src="${avatarUrl}" alt="Avatar" width="35" height="35">
    </section>`
  );
};
