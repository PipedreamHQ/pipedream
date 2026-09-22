import { ConfigurationError } from "@pipedream/platform";

/**
 * Parses the `records` prop (a JSON string) into an array of validated record
 * objects. Rejects malformed JSON, non-arrays, empty arrays, and any element
 * that is not a plain object carrying the required `name`, `type`, and
 * `content` fields.
 *
 * @param {string} value - the raw `records` prop value
 * @returns {object[]} the parsed record objects
 */
export function parseRecords(value) {
  let records;
  try {
    records = JSON.parse(value);
  } catch {
    throw new ConfigurationError("The `records` field must be a valid JSON array of record objects.");
  }
  if (!Array.isArray(records) || records.length === 0) {
    throw new ConfigurationError("The `records` field must be a non-empty JSON array of record objects.");
  }
  records.forEach((record, index) => {
    if (typeof record !== "object" || record === null || Array.isArray(record)) {
      throw new ConfigurationError(`Record at index ${index} must be an object with \`name\`, \`type\`, and \`content\` fields.`);
    }
    for (const field of [
      "name",
      "type",
      "content",
    ]) {
      if (record[field] === undefined || record[field] === null || record[field] === "") {
        throw new ConfigurationError(`Record at index ${index} is missing the required \`${field}\` field.`);
      }
    }
  });
  return records;
}
