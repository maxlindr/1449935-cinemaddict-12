export const createProfileTemplate = (rating, avatarUrl) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="${avatarUrl}" alt="Avatar" width="35" height="35">
    </section>`
  );
};
