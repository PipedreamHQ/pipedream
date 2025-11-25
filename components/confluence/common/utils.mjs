import { ConfigurationError } from "@pipedream/platform";

function optionalParseAsJSON(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function parseObjectEntries(obj = {}) {
  if (typeof obj === "string") {
    try {
      obj = JSON.parse(obj);
    } catch (e) {
      throw new ConfigurationError(`Invalid JSON string provided: ${e.message}`);
    }
  }

  return Object.fromEntries(
    Object.entries(obj || {}).map(([
      key,
      value,
    ]) => [
      key,
      optionalParseAsJSON(value),
    ]),
  );
}
