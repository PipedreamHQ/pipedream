import isArray from "lodash/isArray.js";
import isEmpty from "lodash/isEmpty.js";
import isString from "lodash/isString.js";
import get from "lodash/get.js";

export const sanitizedArray = (value) => {
  if (isArray(value)) {
    return value.map((item) => get(item, "value", item));
  }

  if (!isString(value)) {
    throw new Error(`${value} is not an array-like string`);
  }

  // Return an empty array if string is empty
  if (isEmpty(value)) {
    return [];
  }

  // It is string, try to convert it in an array
  return value.replace(/["'[\]\s]+/g, "").split(",");
};
