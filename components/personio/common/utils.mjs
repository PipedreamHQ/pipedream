export const parseArray = (arr) => {
  let newArr = [];
  if (typeof arr === "string") {
    try {
      newArr = JSON.parse(arr);
    } catch (e) {
      return arr;
    }
  }
  if (Array.isArray(newArr)) {
    newArr = newArr.map((item) => parseArray(item));
  }
  return newArr;
};

export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      // eslint-disable-next-line no-unused-vars
      _,
      v,
    ]) => (v != null && v != ""))
    .reduce((acc, [
      k,
      v,
    ]) => ({
      ...acc,
      [k]: (!Array.isArray(v) && v === Object(v))
        ? clearObj(v)
        : v,
    }), {});
};

export const toSingleLineString = (multiLineString) => {
  return multiLineString
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ");
};
