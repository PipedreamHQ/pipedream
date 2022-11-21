export default {
  parseOrUndefined(value) {
    if (value === undefined) {
      return undefined;
    }
    return typeof(value) === "object"
      ? value
      : JSON.parse(value);
  },
  async streamIterator(stream) {
    const resources = [];
    for await (const resource of stream) {
      resources.push(resource);
    }
    return resources;
  },
};
