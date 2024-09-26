const removeNullEntries = (obj) =>
  obj && Object.entries(obj).reduce((acc, [
    key,
    value,
  ]) => {
    const isNumber = typeof value === "number";
    const isBoolean = typeof value === "boolean";
    const isNotEmpyString = typeof value === "string" && value.trim() !== "";
    const isNotEmptyArray = Array.isArray(value) && value.length;
    const isNotEmptyObject =
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length !== 0;
    isNotEmptyObject && (value = removeNullEntries(value));
    return ((value || value === false) &&
      (isNotEmpyString || isNotEmptyArray || isNotEmptyObject || isBoolean || isNumber))
      ? {
        ...acc,
        [key]: value,
      }
      : acc;
  }, {});

export {
  removeNullEntries,
};
