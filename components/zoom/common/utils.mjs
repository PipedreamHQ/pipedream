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

function doubleEncode(value) {
  if (value.startsWith("/") || value.includes("//")) {
    return encodeURIComponent(encodeURIComponent(value));
  }
  return value;
}

export default {
  streamIterator,
  summaryEnd,
  doubleEncode,
};
