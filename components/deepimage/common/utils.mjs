import { getFileStream } from "@pipedream/platform";

export const isValidUrl = (urlString) => {
  var urlPattern = new RegExp("^(https?:\\/\\/)?" + // validate protocol
"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
"((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
"(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
"(\\#[-a-z\\d_]*)?$", "i"); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const streamToBase64 = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString("base64"));
    });
    stream.on("error", reject);
  });
};

export const getUrlOrFile = async (url) => {
  if (!isValidUrl(url)) {
    const stream = await getFileStream(url);
    const base64Image = await streamToBase64(stream);
    return `base64,${base64Image}`;
  }
  return url;
};
