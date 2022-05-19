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

const formatArrayStrings = (objectArray, ALLOWED_KEYS, fieldName) => {
  const updatedArray = [];
  const errors = [];
  if (objectArray?.length) {
    for (let i = 0; i < objectArray.length; i++) {
      try {
        if (emptyStrToUndefined(objectArray[i])) {
          const obj = JSON.parse(objectArray[i]);
          Object.keys(obj).forEach((key) => {
            if (!ALLOWED_KEYS.includes(key)) {
              errors.push(
                `${fieldName}[${i}] error: ${key} is not present or allowed in object`,
              );
            }
          });
          updatedArray.push(obj);
        } else {
          throw new Error();
        }
      } catch (error) {
        throw new ConfigurationError(`Object is empty or malformed on [${i}]`);
      }
    }
  }
  if (errors.length) {
    throw new ConfigurationError(
      errors.join(",") + `. Allowed keys are ${ALLOWED_KEYS.join(",")}`,
    );
  }
  return updatedArray;
};

export {
  removeNullEntries, formatArrayStrings,
};
