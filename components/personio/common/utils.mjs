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
      _,
      v,
    ]) => (v != null && v != "" && _ != "$emit"))
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

