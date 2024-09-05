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
  if (value === undefined || typeof(value) === "object") {
    return value;
  }

  if (!isJson(value)) {
    throw new ConfigurationError(`Make sure the value contains a valid JSON string: ${value}`);
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
    throw new ConfigurationError("Make sure the value contains a valid JSON array");
  }
}

async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

export default {
  valueToObject,
  parseArray: (value) => parseArray(value).map(valueToObject),
  iterate,
};
