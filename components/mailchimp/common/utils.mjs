import { ConfigurationError } from "@pipedream/platform";

const removeNullEntries = (obj) =>
  obj && Object.entries(obj).reduce((acc, [
    key,
    value,
  ]) => {
    const isNumber = typeof value === "number";
    const isBoolean = typeof value === "boolean";
    const isNotEmpyString = typeof value === "string";
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

const emptyStrToUndefined = (value) => {
  const trimmed = typeof (value) === "string" && value.trim();
  return trimmed === ""
    ? false
    : true;
};

const convertStringObjects = (name, arr) => {
  try {
    return Array.isArray(arr) &&
      arr.filter(emptyStrToUndefined).map((elem) => JSON.parse(elem));
  } catch (e) {
    throw new ConfigurationError(`Invalid JSON string found in ${name}.`);
  }
};

export {
  removeNullEntries, convertStringObjects,
};
