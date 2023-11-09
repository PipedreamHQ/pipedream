/* eslint-disable no-unused-vars */
export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
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
