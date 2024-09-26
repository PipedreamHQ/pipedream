import { ConfigurationError } from "@pipedream/platform";

function isJson(value) {
  value =
    typeof(value) !== "string"
      ? JSON.stringify(value)
      : value;

  try {
    value = JSON.parse(value);
  } catch (e) {
    return false;
  }

  return typeof(value) === "object" && value !== null;
}

function valueToObject(value) {
  if (!isJson(value)) {
    return value;
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
  parseArray: (value) => parseArray(value).map(valueToObject),
};
