async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function cleanObject(o) {
  for (var k in o || {}) {
    if (typeof o[k] === "undefined") {
      delete o[k];
    }
  }
  return o;
}

export default {
  streamIterator,
  cleanObject,
};
