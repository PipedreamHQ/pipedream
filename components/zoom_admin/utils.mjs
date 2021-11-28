import isArray from "lodash/isArray.js";
import isEmpty from "lodash/isEmpty.js";
import isString from "lodash/isString.js";
import get from "lodash/get.js";

export const sanitizedArray = (value) => {
  if (isArray(value)) {
    return value.map((item) => get(item, "value", item));
  }

  // If is string, try to convert it in an array
  if (isString(value)) {
    // Return an empty array if string is empty
    if (isEmpty(value)) {
      return [];
    }

    return value.replace(/["'[\]\s]+/g, "").split(",");
  }

  throw new Error(`${value} is not an array or an array-like`);
};
