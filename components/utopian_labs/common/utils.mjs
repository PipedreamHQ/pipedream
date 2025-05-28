import { ConfigurationError } from "@pipedream/platform";

function optionalParseAsJSON(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function parseObjectEntries(value = {}) {
  const obj = typeof value === "string"
    ? JSON.parse(value)
    : value;
  return Object.fromEntries(
    Object.entries(obj).map(([
      key,
      value,
    ]) => [
      key,
      optionalParseAsJSON(value),
    ]),
  );
}

export function parseStringAsJSON(value) {
  try {
    return typeof value === "string"
      ? JSON.parse(value)
      : value;
  } catch (err) {
    throw new ConfigurationError(`Error parsing JSON string: ${err}`);
  }
}

export function parseArrayAsJSON(value) {
  try {
    return value.map((item) => JSON.parse(item));
  } catch (err) {
    throw new ConfigurationError(`Error parsing JSON string in array: ${err}`);
  }
}
