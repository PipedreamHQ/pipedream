import { ConfigurationError } from "@pipedream/platform";

const parseJson = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    throw new ConfigurationError("Must be a valid JSON value.");
  }
};

const isPdf = (filePath) => {
  const path = filePath.split("?")[0].split("#")[0];
  return path.toLowerCase().endsWith(".pdf");
};

const streamToBase64Url = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("base64url");
};

export default {
  isPdf,
  parseJson,
  streamToBase64Url,
};
