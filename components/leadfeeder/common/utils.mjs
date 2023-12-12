async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function getFormatDate(daysAgo = 0, now = Date.now()) {
  const past = 1000 * 60 * 60 * 24 * daysAgo;
  const date = new Date(now - past);
  return date.toISOString().split("T")[0];
}

export default {
  streamIterator,
  getFormatDate,
};
