export const parseObject = (obj) => {
  if (!obj) return undefined;

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
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
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

export const checkUrl = (url) => {
  if (url.startsWith("/books/v3")) {
    return url.substring(9);
  }
  if (url.startsWith("/v3")) {
    return url.substring(3);
  }
  return url;
};
