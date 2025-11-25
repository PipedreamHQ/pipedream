import { ConfigurationError } from "@pipedream/platform";

function optionalParseAsJSON(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function parseObjectEntries(value = {}) {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (e) {
      throw new ConfigurationError(`Invalid JSON string provided: ${e.message}`);
    }
  }

  return Object.fromEntries(
    Object.entries(value).map(([
      key,
      value,
    ]) => [
      key,
      optionalParseAsJSON(value),
    ]),
  );
}
