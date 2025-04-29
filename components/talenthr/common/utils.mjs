export const parseObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    return JSON.parse(obj);
  }
  return obj;
};

export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      ,
      v,
    ]) => (v != null && v != "" && JSON.stringify(v) != "{}"))
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
