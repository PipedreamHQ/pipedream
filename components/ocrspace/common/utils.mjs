import fs from "fs";
import mime from "mime";

export const isValidUrl = (urlString) => {
  var urlPattern = new RegExp("^(https?:\\/\\/)?" + // validate protocol
"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
"((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
"(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
"(\\#[-a-z\\d_]*)?$", "i"); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const checkTmp = (filename) => {
  if (filename.indexOf("/tmp") === -1) {
    return `/tmp/${filename}`;
  }
  return filename;
};

export const getUrlOrFile = (url) => {
  if (!isValidUrl(url)) {
    const filePath = checkTmp(url);
    const data = fs.readFileSync(filePath);
    const mimeType = mime.getType(filePath);
    const base64Image = Buffer.from(data, "binary").toString("base64");
    return {
      file: `data:${mimeType};base64,${base64Image}`,
    };
  }
  return {
    url,
  };
};
