const calcRank = (rating) => {
  switch (true) {
    case rating === 0:
      return ``;
    case rating <= 10:
      return `novice`;
    case rating <= 20:
      return `fan`;
    default:
      return `movie buff`;
  }
};

export const createProfileTemplate = (rating, avatarUrl) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${calcRank(rating)}</p>
      <img class="profile__avatar" src="${avatarUrl}" alt="Avatar" width="35" height="35">
    </section>`
  );
};
