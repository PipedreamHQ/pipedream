export const parseObject = (obj) => {
  if (!obj) {
    return {};
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(parseObject);
  }
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([
        key,
        value,
      ]) => [
        key,
        parseObject(value),
      ]),
    );
  }
  return obj;
};

/**
  * Get the MIME type for a given file format
  * @param {string} format - The file format (e.g., 'png', 'jpg')
  * @returns {string} The corresponding MIME type
*/
export const getMimeType = (format) => {
  if (!format || typeof format !== "string") {
    return "application/octet-stream";
  }

  const mimeTypes = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
  };

  const normalizedFormat = format.toLowerCase().trim();
  return mimeTypes[normalizedFormat] || "application/octet-stream";
};
