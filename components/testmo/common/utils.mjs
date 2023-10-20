export const parseArray = (array) => {
  let parsedArray = array;
  if (array) {
    if (!Array.isArray(array)) {
      parsedArray = JSON.parse(array);
    }

    parsedArray = parsedArray.map((item) => {
      if (typeof item != "object") {
        return JSON.parse(item);
      }
      return item;
    });
  }
  return parsedArray;
};
