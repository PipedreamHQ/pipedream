import { ConfigurationError } from "@pipedream/platform";

const UNSAFE_KEYS = new Set([
  "__proto__",
  "constructor",
  "prototype",
]);

/**
 * Object props can arrive as a JSON string (e.g. from the UI or an MCP
 * client). Returns a plain object, undefined when no value is given, and
 * throws a ConfigurationError when the string is not a valid JSON object.
 */
function parseJsonObject(value, label) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return value;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // fall through to the error below
  }
  throw new ConfigurationError(`${label} must be a valid JSON object`);
}

/**
 * Keep only the requested fields of each item. Dot paths (e.g. `owner.name`)
 * are supported. Returns the items unchanged when no fields are given, and an
 * empty array when items is null or undefined.
 */
function pluckFields(items, fields) {
  const list = items ?? [];
  if (!fields?.length) return list;
  return list.map((item) => {
    const picked = {};
    for (const path of fields) {
      const keys = path.split(".");
      if (keys.some((key) => UNSAFE_KEYS.has(key))) continue;
      const value = keys.reduce((obj, key) => obj?.[key], item);
      if (value === undefined) continue;
      let target = picked;
      keys.slice(0, -1).forEach((key) => {
        target = target[key] ??= {};
      });
      target[keys[keys.length - 1]] = value;
    }
    return picked;
  });
}

export default {
  parseJsonObject,
  pluckFields,
};
