export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      key,
      value,
    ]) => (value != null && value != "" && key != "$emit"))
    .reduce(
      (acc, [
        key,
        value,
      ]) => ({
        ...acc,
        [key]: (!Array.isArray(value) && value === Object(value))
          ? clearObj(value)
          : value,
      }),
      {},
    );
};
