import { ConfigurationError } from "@pipedream/platform";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Props typed `string[]` arrive as an array of strings even when each entry is
 * meant to be an object, so JSON entries have to be parsed back out. Objects
 * are passed through untouched for the case where a previous step supplies
 * them directly, and a single string holding a whole JSON array is unwrapped
 * rather than nested — that is what `{{ JSON.stringify(steps.foo.items) }}`
 * produces, and nesting it would reach the API as `[[{...}]]`.
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

function parseEntry(entry, label) {
  try {
    return JSON.parse(entry);
  } catch (error) {
    throw new ConfigurationError(`**${label}** entries must be valid JSON objects. Could not parse: ${entry}`);
  }
}

function assertObject(value, label) {
  if (!isPlainObject(value)) {
    throw new ConfigurationError(`**${label}** entries must be JSON objects. Received: ${JSON.stringify(value)}`);
  }

  return value;
}
