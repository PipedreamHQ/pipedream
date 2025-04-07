import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

function normalizeFilePath(path) {
  return path.startsWith("/tmp/")
    ? path
    : `/tmp/${path}`;
}

function checkForExtension(filename, ext = "pdf") {
  return filename.endsWith(`.${ext}`)
    ? filename
    : `${filename}.${ext}`;
}

function downloadToTmp(response, filename) {
  const rawcontent = response.toString("base64");
  const buffer = Buffer.from(rawcontent, "base64");
  const filePath = normalizeFilePath(filename);
  fs.writeFileSync(filePath, buffer);

  return [
    filename,
    filePath,
  ];
}

function handleErrorMessage(error) {
  if (!error) {
    throw new ConfigurationError("Unknown error occurred");
  }
  let errorMessage = error.name;
  if (error.response?.data) {
    const text = Buffer.from(error.response.data).toString("utf-8");
    try {
      errorMessage = JSON.stringify(JSON.parse(text));
    } catch (parseErr) {
      errorMessage = text;
    }
  }
  throw new ConfigurationError(errorMessage);
}

export default {
  normalizeFilePath,
  checkForExtension,
  downloadToTmp,
  handleErrorMessage,
};
