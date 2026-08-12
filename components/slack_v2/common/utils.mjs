/**
 * Shared helpers for the `fields` projection offered by the list/history actions.
 *
 * Three actions (Get Channel History, Get Thread Replies, List Channels) let the caller
 * name the properties they want back. Both halves of that feature — normalizing the prop
 * value and applying it — were copy-pasted into each action; keeping one copy means a fix
 * to either lands everywhere at once.
 */

/**
 * Normalize a `string[]` prop that an LLM caller may well send as a CSV string.
 *
 * `fields` is declared `string[]`, but MCP/LLM callers routinely pass `"text,ts,user"`.
 * Spreading a bare string into a keep-set yields single characters, which match no key,
 * so the caller would silently get back nothing at all.
 *
 * @param {string|string[]|undefined} value - the raw prop value
 * @returns {string[]|null} the requested field names, or null when none were requested
 */
export function parseFields(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length) {
    return value.split(",")
      .map((f) => f.trim())
      .filter(Boolean);
  }
  return null;
}

/**
 * Keep only the requested properties of a record.
 *
 * Unknown names are ignored rather than returned as `undefined`, so a typo shrinks the
 * payload instead of corrupting it with null-valued keys.
 *
 * @param {object} record - a message or channel object
 * @param {string[]} fields - property names to keep
 * @returns {object} the projected record
 */
export function pickFields(record, fields) {
  const out = {};
  for (const field of fields) {
    if (record[field] !== undefined) out[field] = record[field];
  }
  return out;
}

/**
 * Apply a `fields` projection to a list, or return it untouched when none was requested.
 *
 * The no-fields path returns the ORIGINAL array, which is what makes `fields` additive:
 * a caller that omits it gets exactly what these actions have always returned.
 *
 * @param {object[]} records - the records to project
 * @param {string|string[]|undefined} value - the raw `fields` prop value
 * @returns {object[]} projected records, or `records` unchanged
 */
export function projectFields(records, value) {
  const fields = parseFields(value);
  return fields?.length
    ? records.map((r) => pickFields(r, fields))
    : records;
}

export default {
  parseFields,
  pickFields,
  projectFields,
};
