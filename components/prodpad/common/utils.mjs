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

function mapOrParse(value, mapper = (item) => item) {
  try {
    if (!value) {
      return [];
    }

    const array = Array.isArray(value) && value.map(mapper) || JSON.parse(value);

    if (!Array.isArray(array)) {
      throw new Error("Object is not an array");
    }

    return array;

  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid array object");
  }
}

export default {
  streamIterator,
  summaryEnd,
  mapOrParse,
};
