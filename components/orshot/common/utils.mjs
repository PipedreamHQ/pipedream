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

/**
 * True when a value is missing, not an object, or an object with no keys.
 * @param {*} obj - The value to check
 * @returns {boolean}
 */
export const isEmptyObject = (obj) =>
  !obj || typeof obj !== "object" || Object.keys(obj).length === 0;

/**
 * Parse a webhook body that may arrive as a JSON string or an object.
 * @param {string|object} body - The raw body
 * @returns {object} The parsed body, or `{}` when it cannot be parsed
 */
export const parseBody = (body) => {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body || {};
};
