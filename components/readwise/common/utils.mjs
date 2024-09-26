/* eslint-disable no-unused-vars */
export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      _,
      v,
    ]) => v != null)
    .reduce(
      (acc, [
        k,
        v,
      ]) => ({
        ...acc,
        [k]: v === Object(v)
          ? clearObj(v)
          : v,
      }),
      {},
    );
};
