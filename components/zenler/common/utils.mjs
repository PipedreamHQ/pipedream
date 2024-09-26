async function streamIterator(stream) {
  let resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

export default {
  streamIterator,
};
