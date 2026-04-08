export const omitEmpty = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([
      , v,
    ]) => v !== undefined && v !== null),
  );
};
