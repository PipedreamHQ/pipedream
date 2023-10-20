function getDataFromStream(stream) {
  const buffer = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => buffer.push(chunk));
    stream.on("end", () => {
      const data = Buffer.concat(buffer).toString();
      return resolve(JSON.parse(data));
    });
    stream.on("error", (err) => reject(err));
  });
}

function parseLinkHeader(linkHeader) {
  return linkHeader?.split(",")
    .reduce((props, link) => {
      const [
        url,
        rel,
      ] = link.split(";");
      const [
        , value,
      ] = url.split("<");
      const [
        , key,
      ] = rel.split("=");
      const clearKey = key.replace(/"/g, "");
      const clearValue = value.replace(/>/g, "");
      return {
        ...props,
        [clearKey]: clearValue,
      };
    }, {});
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
  getDataFromStream,
  parseLinkHeader,
};
