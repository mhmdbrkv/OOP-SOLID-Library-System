export const displayBookData = (book) => {
  if (!book) return null;
  return book.toJSON();
};

export const displayUserData = (user) => {
  if (!user) return null;
  return user.toJSON();
};
