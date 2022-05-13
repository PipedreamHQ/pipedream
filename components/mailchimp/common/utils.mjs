const removeNullEntries = (obj) =>
  Object.entries(obj).reduce((acc, [
    key,
    value,
  ]) => {
    const isNotEmpyString = typeof value === "string";
    const isNotEmptyArray = Array.isArray(value) && value.length;
    const isNotEmptyObject =
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length !== 0;
    return value && (isNotEmpyString || isNotEmptyArray || isNotEmptyObject)
      ? {
        ...acc,
        [key]: value,
      }
      : acc;
  }, {});

export {
  removeNullEntries,
};
