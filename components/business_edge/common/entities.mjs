/**
 * Generic entity codes when the args API cannot be read (wrong tenant, offline,
 * or schema shape changed).
 */
export const FALLBACK_ENTITY_OPTIONS = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
];

/**
 * Best-effort parse of Entity dropdown from Business Edge `args.json` payloads.
 * @param {unknown} payload
 * @returns {{ label: string, value: string }[]|null}
 */
export function parseEntityOptionsFromArgsPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const root = /** @type {Record<string, unknown>} */ (payload);
  const entity =
    root.properties && typeof root.properties === "object"
      ? /** @type {Record<string, unknown>} */ (root.properties).Entity
      : root.Entity;

  if (!entity || typeof entity !== "object") {
    return null;
  }

  const ent = /** @type {Record<string, unknown>} */ (entity);
  const enumVals = ent.enum;
  if (Array.isArray(enumVals) && enumVals.length > 0) {
    return enumVals.map((v) => {
      const value = String(v);
      return {
        label: value,
        value,
      };
    });
  }

  const oneOf = ent.oneOf;
  if (Array.isArray(oneOf) && oneOf.length > 0) {
    const out = [];
    for (const item of oneOf) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const c = /** @type {Record<string, unknown>} */ (item).const;
      if (c != null && c !== "") {
        const value = String(c);
        out.push({
          label: value,
          value,
        });
      }
    }
    if (out.length > 0) {
      return out;
    }
  }

  return null;
}
