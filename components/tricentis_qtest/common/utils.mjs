export function isValidProperty(entry) {
  return entry !== null
    && typeof entry === "object"
    && !Array.isArray(entry)
    && Number.isInteger(entry.field_id)
    && entry.field_value !== undefined;
}
