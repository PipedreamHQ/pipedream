import { ConfigurationError } from "@pipedream/platform";

/**
 * Props typed `string[]` arrive as an array of strings even when each entry is
 * meant to be an object, so JSON entries have to be parsed back out. Objects
 * are passed through untouched for the case where a previous step supplies
 * them directly.
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

  return values.map((entry) => {
    if (typeof entry !== "string") {
      return entry;
    }

    try {
      return JSON.parse(entry);
    } catch (error) {
      throw new ConfigurationError(`**${label}** entries must be valid JSON objects. Could not parse: ${entry}`);
    }
  });
}
