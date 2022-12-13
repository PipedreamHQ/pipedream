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

export default {
  streamIterator,
  summaryEnd,
};
