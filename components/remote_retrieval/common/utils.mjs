async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function getParamFromUrl(url, key = "cursor") {
  if (!url) {
    return null;
  }
  const parsedUrl = new URL(url);
  return parsedUrl.searchParams.get(key);
}

export default {
  streamIterator,
  getParamFromUrl,
};
