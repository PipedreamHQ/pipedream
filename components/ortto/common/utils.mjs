import { ConfigurationError } from "@pipedream/platform";

function summaryEnd(count, singular, plural) {
  if (!plural) {
    plural = singular + "s";
  }
  const noun = count === 1 && singular || plural;
  return `${count} ${noun}`;
}

async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function getProperties(object) {
  if (!object) {
    return [];
  }

  try {
    if (typeof(object) === "string") {
      object = JSON.parse(object);
    }

    return Array.isArray(object)
      ? object.map((properties) =>
        typeof(properties) === "string"
          ? JSON.parse(properties)
          : properties)
      : [
        object,
      ];
  } catch (error) {
    throw new ConfigurationError(`Not set with the right JSON structure: ${error}`);
  }
}

export default {
  streamIterator,
  summaryEnd,
  getProperties,
};
