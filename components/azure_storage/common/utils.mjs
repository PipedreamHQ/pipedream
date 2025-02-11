import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

function checkTmp(filePath) {
  const adjustedPath = filePath.startsWith("/tmp")
    ? filePath
    : `/tmp/${filePath}`;

  if (!fs.existsSync(adjustedPath)) {
    throw new ConfigurationError("File does not exist!");
  }

  return adjustedPath;
}

function getDataFromFile(filePath) {
  const path = checkTmp(filePath);
  const file = fs.readFileSync(path);
  return file;
}

function getFilenameFromPath(filePath) {
  const pathParts = filePath.split("/");
  return pathParts[pathParts.length - 1];
}

export default {
  getDataFromFile,
  getFilenameFromPath,
};
