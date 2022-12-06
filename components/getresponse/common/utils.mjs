async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function getDataFromStream(stream) {
  const buffer = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => buffer.push(chunk));
    stream.on("end", () => {
      const dataStr = Buffer.concat(buffer).toString();
      return resolve(JSON.parse(dataStr));
    });
    stream.on("error", (err) => reject(err));
  });
}

export default {
  streamIterator,
  getDataFromStream,
};
