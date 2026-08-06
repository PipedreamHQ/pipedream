import { ConfigurationError } from "@pipedream/platform";

/**
 * Parses an array of JSON-object props, validating each is a plain object.
 *
 * @param {Array} items - The prop values (JSON strings or objects)
 * @param {string} label - A human-readable name for the field, used in errors
 * @returns {Array<object>} The parsed objects
 */
export function parseJsonObjects(items, label) {
  return items.map((item) => {
    let parsed = item;
    if (typeof item === "string") {
      try {
        parsed = JSON.parse(item);
      } catch (error) {
        throw new ConfigurationError(`Each ${label} must be a valid JSON object. Could not parse: \`${item}\``);
      }
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new ConfigurationError(`Each ${label} must be a JSON object.`);
    }
    return parsed;
  });
}
