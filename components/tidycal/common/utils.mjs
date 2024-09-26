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

function removeDigits(dateStr) {
  return dateStr?.replace(/\.[0-9]+/g, "");
}

export default {
  streamIterator,
  summaryEnd,
  removeDigits,
};
