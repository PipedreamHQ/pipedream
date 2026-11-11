import { ConfigurationError } from "@pipedream/platform";

/**
 * Reports whether a value is a plain JSON object, i.e. not an array, not null,
 * not a primitive, and not a class instance such as a `Date` or a `Map`.
 *
 * The prototype check matters because these objects are serialized into the
 * request body: a `Date` would reach the API as a bare ISO string and a `Map`
 * as `{}`, both silently, where a class instance is far more likely to be a
 * mistake in the workflow than an intended contact.
 *
 * @param {*} value - The value to test.
 * @returns {boolean} `true` when the value is a non-null, non-array object
 * whose prototype is `Object.prototype` or `null`.
 */
function isPlainObject(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
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

  return values.flatMap((entry, index) => {
    // Unwrap an array only when it came out of a JSON string, which is the
    // `{{ JSON.stringify(steps.foo.items) }}` case the unwrapping exists for.
    // An entry that is already an array was not stringified, so it is a
    // nesting mistake rather than that case, and `assertObject` rejects it.
    const isJsonEntry = typeof entry === "string";
    const parsed = isJsonEntry
      ? parseEntry(entry, label, index)
      : entry;

    if (isJsonEntry && Array.isArray(parsed)) {
      return parsed.map((item) => assertObject(item, label, index));
    }

    return assertObject(parsed, label, index);
  });
}

/**
 * Describes a value's type in words, so an error can say what arrived without
 * quoting it back.
 *
 * @param {*} value - The value to describe.
 * @returns {string} A short, content-free description, e.g. `"a string"`.
 */
function describeType(value) {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "an array";
  }

  if (typeof value === "object") {
    // A class name, e.g. `Date` — the name of the type, never its contents.
    const name = Object.getPrototypeOf(value)?.constructor?.name;

    return name
      ? `a ${name} instance`
      : "an object";
  }

  return `a ${typeof value}`;
}

/**
 * Parses a single JSON entry, locating an invalid one by position.
 *
 * The offending text is deliberately left out of the error: these entries are
 * recipient records, so they routinely hold email addresses and phone numbers,
 * and a ConfigurationError message is persisted in the execution log where a
 * workspace member who is not the sender can read it. The position and length
 * are enough to find the bad entry in the prop.
 *
 * @param {string} entry - The raw JSON string.
 * @param {string} label - The prop's label, used in the error message.
 * @param {number} index - The entry's zero-based position in the prop.
 * @returns {*} The parsed value.
 * @throws {ConfigurationError} When the entry is not valid JSON.
 */
function parseEntry(entry, label, index) {
  try {
    return JSON.parse(entry);
  } catch {
    throw new ConfigurationError(`**${label}** entry ${index + 1} is not valid JSON (${entry.length} characters). Each entry must be a JSON object, or an array of JSON objects, e.g. \`{"email": "jane@example.com"}\` or \`[{"email": "jane@example.com"}]\`. The entry itself is omitted here because it can contain recipient contact details.`);
  }
}

/**
 * Asserts that a parsed entry is a plain object, so a scalar such as `42` or
 * `null` fails here with a clear message rather than as an opaque API error.
 * Reports the value's type rather than the value, for the same reason
 * `parseEntry` omits the raw text.
 *
 * @param {*} value - The parsed entry.
 * @param {string} label - The prop's label, used in the error message.
 * @param {number} index - The entry's zero-based position in the prop.
 * @returns {object} The value, unchanged, when it is a plain object.
 * @throws {ConfigurationError} When the value is not a plain object.
 */
function assertObject(value, label, index) {
  if (!isPlainObject(value)) {
    throw new ConfigurationError(`**${label}** entry ${index + 1} must be a JSON object, but parsed to ${describeType(value)}.`);
  }

  return value;
}
