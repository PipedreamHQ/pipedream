/**
 * Keep only the named fields (plus `id`, so results stay chainable) on each item.
 */
function pluck(item, names) {
  const keys = [
    "id",
    ...names,
  ];
  return Object.fromEntries(
    keys.filter((key) => item && key in item).map((key) => [
      key,
      item[key],
    ]),
  );
}

/**
 * Apply the caller's `fields` (or the tool's curated defaults) to a list of items.
 */
function selectFields(items, fields, defaults) {
  const names = fields?.length
    ? fields
    : defaults;
  return items.map((item) => pluck(item, names));
}

/**
 * Parse a JSON-object string prop (e.g. custom fields) into an object.
 */
function parseJsonObject(value, label = "value") {
  if (value === undefined || value === null || value === "") {
    return {};
  }
  if (typeof value === "object") {
    return value;
  }
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`${label} must be a JSON object string, e.g. {"custom_preconds": "Power is on"}`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object, e.g. {"custom_preconds": "Power is on"}`);
  }
  return parsed;
}

export default {
  pluck,
  selectFields,
  parseJsonObject,
};
