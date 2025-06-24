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

export const clearObject = (obj) => {
  return Object.entries(obj)
    .filter(([
      _,
      v,
    ]) => (v != null && v != "" && _ != undefined))
    .reduce((acc, [
      k,
      v,
    ]) => ({
      ...acc,
      [k]: (!Array.isArray(v) && v === Object(v))
        ? clearObject(v)
        : v,
    }), {});
};

export const snakeCaseToTitleCase = (s) =>
  s.replace(/^_*(.)|_+(.)/g, (s, c, d) => c
    ? c.toUpperCase()
    : " " + d.toUpperCase());
