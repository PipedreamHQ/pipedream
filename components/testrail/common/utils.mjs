/** Unix seconds -> ISO-8601 string (null stays null). */
export function toIso(seconds) {
  if (seconds === null || seconds === undefined) {
    return null;
  }
  return new Date(seconds * 1000).toISOString();
}

/** Keep only the named keys of each object. `id` is always kept so results can be chained. */
export function pluck(obj, names) {
  const keys = [
    "id",
    ...names,
  ];
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [
      key,
      obj[key],
    ]),
  );
}

/** Copy `custom_*` fields that have a value (TestRail returns every custom field, mostly null). */
export function nonNullCustomFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([
      key,
      value,
    ]) => key.startsWith("custom_") && value !== null && value !== ""),
  );
}

/** Join a list of ids into TestRail's comma-separated filter format. */
export function joinIds(ids) {
  if (!ids?.length) {
    return undefined;
  }
  return ids.map((id) => String(id).trim()).join(",");
}

/** Parse a prop that may be an object or a JSON string into an object. */
export function parseObject(value) {
  if (!value) {
    return {};
  }
  if (typeof value === "string") {
    return JSON.parse(value);
  }
  return value;
}
