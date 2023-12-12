async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

export default {
  streamIterator,
  getCurrentDate,
};
