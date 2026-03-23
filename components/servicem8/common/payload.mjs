/**
 * Helpers for building ServiceM8 POST bodies from explicit action props.
 * @module servicem8/common/payload
 */

/**
 * Drop undefined/null and empty strings (keeps 0 and false).
 * @param {Record<string, unknown>} fields
 * @returns {Record<string, unknown>}
 */
export function bodyFromFields(fields) {
  const out = {};
  for (const [
    k,
    v,
  ] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out;
}

/**
 * @param {boolean|undefined|null} v
 * @returns {0|1|undefined}
 */
export function optionalBool01(v) {
  if (v === undefined || v === null) return undefined;
  return v
    ? 1
    : 0;
}

/**
 * @param {unknown} raw
 * @returns {Record<string, unknown>}
 */
export function normalizeServiceM8Record(raw) {
  if (raw == null || typeof raw !== "object") return {};
  if (Array.isArray(raw)) {
    const first = raw[0];
    return first && typeof first === "object" && !Array.isArray(first)
      ? {
        ...first,
      }
      : {};
  }
  return {
    ...raw,
  };
}

/**
 * GET current record and merge non-empty field updates (ServiceM8 POST replaces the full record).
 * @param {object} svc - `this.servicem8` (app with getResource)
 * @param {object} opts
 */
export async function buildUpdateBody(svc, {
  $, resource, uuid, fields,
}) {
  const raw = await svc.getResource({
    $,
    resource,
    uuid,
  });
  const base = normalizeServiceM8Record(raw);
  return {
    ...base,
    ...bodyFromFields(fields),
  };
}
