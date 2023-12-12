import { ConfigurationError } from "@pipedream/platform";
import crypto from "crypto";

const validateObject = (obj, ALLOWED_KEYS, fieldName) => {
  if (!obj || !Object.keys(obj)?.length) return;
  for (const key of Object.keys(obj)) {
    if (!ALLOWED_KEYS.includes(key)) {
      throw new ConfigurationError(`${fieldName} error: Key ${key} not allowed`);
    }
  }
  return obj;
};

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

const formatArrayStrings = (objectArray, ALLOWED_KEYS, fieldName, allowedValues = null) => {
  const updatedArray = [];
  const errors = [];
  if (objectArray?.length) {
    for (let i = 0; i < objectArray.length; i++) {
      try {
        if (emptyStrToUndefined(objectArray[i])) {
          const obj = JSON.parse(objectArray[i]);
          Object.keys(obj).forEach((key) => {
            const value = obj[key];
            if (!ALLOWED_KEYS.includes(key)) {
              errors.push(
                `${fieldName}[${i}] error: ${key} is not present or allowed in object. Allowed keys are ${ALLOWED_KEYS.join(",")}`,
              );
            }
            if (allowedValues[key] && !allowedValues[key].includes(value)) {
              errors.push(
                `${fieldName}[${i}] error: value ${value} is not present or allowed in key ${key}.`,
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
      errors.join(","),
    );
  }
  return updatedArray;
};

const commaSeparateArray = (arr) => arr?.length && arr.join(",");

const md5Hash = (str) => crypto
  .createHash("md5")
  .update(str.trim())
  .digest("hex");

export {
  removeNullEntries, formatArrayStrings, validateObject, commaSeparateArray, md5Hash,
};
