export const parseArray = (array) => {
  if (Array.isArray(array)) {
    return array.map((item) => {
      if (typeof item != "object") {
        item = JSON.parse(item);
      }
      return item;
    });
  }
  return JSON.parse(array);
};
