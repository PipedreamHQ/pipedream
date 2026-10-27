import { ConfigurationError } from "@pipedream/platform";

const isBlank = (value) =>
  value === undefined || value === null || value === "";

/**
 * Parse a prop that may be an object or a JSON string into an object.
 * Returns undefined when the value is blank.
 */
export function parseObject(value, label) {
  if (isBlank(value)) {
    return undefined;
  }
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new ConfigurationError(`The "${label}" field must be a valid JSON object.`);
    }
  }
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError(`The "${label}" field must be a valid JSON object.`);
  }
  return parsed;
}

/**
 * Parse a prop that may be an array of objects / JSON strings, or a single JSON
 * string encoding an array, into an array of objects.
 */
export function parseObjectArray(value, label) {
  if (isBlank(value)) {
    return [];
  }
  let items = value;
  if (typeof value === "string") {
    try {
      items = JSON.parse(value);
    } catch {
      throw new ConfigurationError(`The "${label}" field must be a JSON object or an array of JSON objects.`);
    }
  }
  if (!Array.isArray(items)) {
    items = [
      items,
    ];
  }
  return items.map((item) => parseObject(item, label));
}

/**
 * Return a shallow copy of `obj` without blank (undefined / null / "") values.
 */
export function omitBlank(obj = {}) {
  return Object.fromEntries(
    Object.entries(obj).filter(([
      , value,
    ]) => !isBlank(value)),
  );
}

/**
 * Build the common fields shared by every document-processing request.
 */
export function buildCommonFields({
  preSignedUrlExpiresIn, metadata,
}) {
  return omitBlank({
    preSignedUrlExpiresIn,
    metadata: parseObject(metadata, "Metadata"),
  });
}
