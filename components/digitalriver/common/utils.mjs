export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      ,
      v,
    ]) => ((v != null && v != "" && JSON.stringify(v) != "{}") || typeof v === "boolean"))
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
