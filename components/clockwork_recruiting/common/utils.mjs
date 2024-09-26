export const parseArray = (arr) => {
  if (!Array.isArray(arr)) {
    return JSON.parse(arr);
  }
  return arr;
};
