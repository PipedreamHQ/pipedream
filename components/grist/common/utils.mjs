import { ConfigurationError } from "@pipedream/platform";

function isJson(value) {
  if (typeof(value) !== "string") {
    return false;
  }

  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
}

function valueToObject(value) {
  if (!isJson(value)) {
    throw new ConfigurationError(`Make sure the custom expression contains a valid JSON object: ${value}`);
  }
  return JSON.parse(value);
}

function parseArray(value) {
  try {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      throw new Error("Not an array");
    }

    return parsedValue;

  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid JSON array object");
  }
}

export default {
  valueToObject,
  parseArray: (value) => parseArray(value).map(valueToObject),
};
