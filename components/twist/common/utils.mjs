import { ConfigurationError } from "@pipedream/platform";

const toArray = (value) => Array.isArray(value)
  ? value
  : [
    value,
  ];

/**
 * Parses a `string[]` prop whose entries are JSON-serialized objects, leaving
 * already-parsed objects untouched.
 */
export const parseObjectArray = (value, fieldName) => {
  if (!value) {
    return undefined;
  }
  return toArray(value).map((item) => {
    if (typeof item !== "string") {
      return item;
    }
    try {
      return JSON.parse(item);
    } catch (error) {
      throw new ConfigurationError(`${fieldName}: \`${item}\` is not valid JSON`);
    }
  });
};

/**
 * Twist notification targets accept either numeric IDs or a sentinel string such
 * as `EVERYONE`. A `string[]` prop carries both, so coerce the numeric entries
 * back to numbers and pass the sentinels through unchanged.
 */
export const parseRecipients = (value) => {
  if (!value) {
    return undefined;
  }
  return toArray(value).map((item) => typeof item === "string" && /^\d+$/.test(item.trim())
    ? Number(item.trim())
    : item);
};
