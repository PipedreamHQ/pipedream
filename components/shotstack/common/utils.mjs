import { ConfigurationError } from "@pipedream/platform";

async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (typeof(valueToParse) === "object" || valueToParse === undefined) {
    return valueToParse;
  }
  try {
    return JSON.parse(valueToParse);
  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid object");
  }
}

export default {
  parse,
  streamIterator,
};
