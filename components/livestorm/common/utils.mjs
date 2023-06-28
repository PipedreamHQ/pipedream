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

function snakeCaseToTileCase(value) {
  return value
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export default {
  streamIterator,
  summaryEnd,
  snakeCaseToTileCase,
};
