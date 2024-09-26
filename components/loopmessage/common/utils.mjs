async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function toSnakeCase(str) {
  return str?.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function keysToSnakeCase(data = {}) {
  return Object.entries(data)
    .reduce((acc, [
      key,
      value,
    ]) => ({
      ...acc,
      [toSnakeCase(key)]: value,
    }), {});
}

export default {
  streamIterator,
  keysToSnakeCase,
};
