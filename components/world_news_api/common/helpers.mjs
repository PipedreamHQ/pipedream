export const getCommaSeparatedListFromArray = (arr) => {
  return arr?.length > 0
    ? arr.join(",")
    : undefined;
};
