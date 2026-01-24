import { ConfigurationError } from "@pipedream/platform";

async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function summaryEnd(count, singular, plural) {
  if (!plural) {
    plural = singular + "s";
  }
  const noun = count === 1 && singular || plural;
  return `${count} ${noun}`;
}

function doubleEncode(value) {
  if ((typeof value === "string") && (value.startsWith("/") || value.includes("//"))) {
    return encodeURIComponent(encodeURIComponent(value));
  }
  return value;
}

function parseArray(value) {
  if (!value) {
    return undefined;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      throw new ConfigurationError(`Could not parse as array: ${value}`);
    }
  }
  if (Array.isArray(value)) {
    return value;
  } else {
    throw new ConfigurationError(`Expected a string or array, got ${typeof value}`);
  }
}

export default {
  streamIterator,
  summaryEnd,
  doubleEncode,
  parseArray,
};
