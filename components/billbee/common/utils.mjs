import { ConfigurationError } from "@pipedream/platform";

function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (valueToParse === undefined || valueToParse === null) {
    return undefined;
  }
  if (typeof(valueToParse) === "object") {
    return valueToParse;
  }
  try {
    const parsed = JSON.parse(valueToParse);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Not an object");
    }
    return parsed;
  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid object");
  }
}

async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

function getNestedProperty(obj, propertyString) {
  const properties = propertyString.split(".");
  return properties.reduce((prev, curr) => prev?.[curr], obj);
}

export default {
  emptyStrToUndefined,
  parse,
  iterate,
  getNestedProperty,
};
