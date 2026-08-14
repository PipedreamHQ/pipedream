import { ConfigurationError } from "@pipedream/platform";

/**
 * Reports whether a value is a plain JSON object, i.e. not an array, not null,
 * and not a primitive.
 *
 * @param {*} value - The value to test.
 * @returns {boolean} `true` when the value is a non-null, non-array object.
 */
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Normalizes a `string[]` prop whose entries represent objects into an array of
 * plain objects.
 *
 * Props typed `string[]` arrive as an array of strings even when each entry is
 * meant to be an object, so JSON entries have to be parsed back out. Objects
 * are passed through untouched for the case where a previous step supplies
 * them directly, and a single string holding a whole JSON array is unwrapped
 * rather than nested — that is what `{{ JSON.stringify(steps.foo.items) }}`
 * produces, and nesting it would reach the API as `[[{...}]]`.
 *
 * @param {string|string[]|object[]} value - The raw prop value.
 * @param {string} label - The prop's label, used in error messages.
 * @returns {object[]|undefined} The parsed objects, or `undefined` when the
 * prop is unset.
 * @throws {ConfigurationError} When an entry is not valid JSON, or parses to
 * something other than an object.
 */
export function parseObjectArray(value, label) {
  if (!value) {
    return undefined;
  }

  const values = Array.isArray(value)
    ? value
    : [
      value,
    ];

  return values.flatMap((entry) => {
    const parsed = typeof entry === "string"
      ? parseEntry(entry, label)
      : entry;

    if (Array.isArray(parsed)) {
      return parsed.map((item) => assertObject(item, label));
    }

    return assertObject(parsed, label);
  });
}

/**
 * Parses a single JSON entry, reporting the offending text when it is invalid.
 *
 * @param {string} entry - The raw JSON string.
 * @param {string} label - The prop's label, used in the error message.
 * @returns {*} The parsed value.
 * @throws {ConfigurationError} When the entry is not valid JSON.
 */
function parseEntry(entry, label) {
  try {
    return JSON.parse(entry);
  } catch (error) {
    throw new ConfigurationError(`**${label}** entries must be valid JSON objects. Could not parse: ${entry}`);
  }
}

/**
 * Asserts that a parsed entry is a plain object, so a scalar such as `42` or
 * `null` fails here with a clear message rather than as an opaque API error.
 *
 * @param {*} value - The parsed entry.
 * @param {string} label - The prop's label, used in the error message.
 * @returns {object} The value, unchanged, when it is a plain object.
 * @throws {ConfigurationError} When the value is not a plain object.
 */
function assertObject(value, label) {
  if (!isPlainObject(value)) {
    throw new ConfigurationError(`**${label}** entries must be JSON objects. Received: ${JSON.stringify(value)}`);
  }

  return value;
}
