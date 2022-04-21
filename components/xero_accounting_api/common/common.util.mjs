const removeNullEntries = (obj) =>
  Object.entries(obj).reduce(
    (acc, [k, v]) => (v ? { ...acc, [k]: v } : acc),
    {}
  );

export { removeNullEntries };
