import path from "node:path";
import { randomUUID } from "node:crypto";
import { ConfigurationError } from "@pipedream/platform";

const EXTENSION_BY_CONTENT_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export const validateDownloadInput = (imageUrl, fileName) => {
  let url;
  try {
    url = new URL(imageUrl);
  } catch {
    throw new ConfigurationError("Image URL must be a complete HTTP or HTTPS URL.");
  }
  if (![
    "http:",
    "https:",
  ].includes(url.protocol) || url.username || url.password) {
    throw new ConfigurationError("Image URL must use HTTP or HTTPS and must not contain username/password credentials.");
  }
  if (fileName !== undefined && (typeof fileName !== "string" || !fileName.trim()
    || fileName === "." || fileName === ".." || /[/\\\0]/.test(fileName))) {
    throw new ConfigurationError("File Name must be a filename without directory paths, e.g. image.png.");
  }
};

export const getDownloadFileName = (imageUrl, contentType, fileName) => {
  if (fileName !== undefined) return fileName;
  const pathExtension = path.extname(new URL(imageUrl).pathname).slice(1)
    .toLowerCase();
  const formatPath = new URL(imageUrl).pathname.split("/").pop();
  const formats = Object.values(EXTENSION_BY_CONTENT_TYPE);
  const extension = EXTENSION_BY_CONTENT_TYPE[contentType]
    ?? (formats.includes(pathExtension)
      ? pathExtension
      : undefined)
    ?? (formats.includes(formatPath)
      ? formatPath
      : "png");
  return `image-${randomUUID()}.${extension}`;
};
