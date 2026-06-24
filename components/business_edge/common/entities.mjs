const DEFAULT_FALLBACK_MAX_ENTITY_CODE = 20;

/**
 * Numeric entity codes when args.json cannot be loaded. Range is configurable so
 * tenants are not limited to three codes when discovery fails.
 * @param {number} [maxCode] Upper bound (clamped 1–99, default 20).
 * @returns {{ label: string, value: string }[]}
 */
export function getFallbackEntityOptions(maxCode = DEFAULT_FALLBACK_MAX_ENTITY_CODE) {
  const n = Math.max(
    1,
    Math.min(99, Number(maxCode) || DEFAULT_FALLBACK_MAX_ENTITY_CODE),
  );
  const out = [];
  for (let i = 1; i <= n; i++) {
    const v = String(i);
    out.push({
      label: v,
      value: v,
    });
  }
  return out;
}

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
