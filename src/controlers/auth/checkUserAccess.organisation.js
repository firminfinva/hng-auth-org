export const checkUserAccessOrganisation = (users, userId) => {
  const filterOrg = users.filter((el) => el.userId == userId);
  return filterOrg.length > 0;
};
