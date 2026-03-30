import { ConfigurationError } from "@pipedream/platform";

/**
 * Builds the POST body for `/V1.0/{Entity}/query`. When the UI sends `filter` as
 * a JSON string (e.g. object builder with a text value), Autotask returns 500
 * unless it is parsed into an array. The whole body may also be a JSON string.
 *
 * @param {object|string|Array} [data] - Body, JSON string, or a bare filter array
 *   (wrapped as `{ filter: [...] }`).
 * @returns {object|undefined} - Object with normalized `filter`
 */
export function parseAutotaskQueryBody(data) {
  if (data == null) {
    return data;
  }
  let body = data;
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed) {
      return {};
    }
    try {
      body = JSON.parse(trimmed);
    } catch (err) {
      const msg = err instanceof Error
        ? err.message
        : String(err);
      throw new ConfigurationError(
        `Autotask query body must be valid JSON when entered as text: ${msg}`,
      );
    }
  }
  if (body == null || typeof body !== "object") {
    throw new ConfigurationError(
      "Autotask query body must be a non-null object with a \"filter\" property " +
        "(or a JSON array of filter expressions, which is wrapped automatically).",
    );
  }
  if (Array.isArray(body)) {
    body = {
      filter: body,
    };
  }
  const out = {
    ...body,
  };
  if (!Object.prototype.hasOwnProperty.call(out, "filter")) {
    return out;
  }
  const f = out.filter;
  if (f == null || typeof f === "object") {
    return out;
  }
  if (typeof f !== "string") {
    return out;
  }
  const trimmed = f.trim();
  if (!trimmed) {
    out.filter = [];
    return out;
  }
  try {
    out.filter = JSON.parse(trimmed);
  } catch (err) {
    const msg = err instanceof Error
      ? err.message
      : String(err);
    throw new ConfigurationError(
      `Autotask "filter" must be valid JSON when entered as text: ${msg}`,
    );
  }
  return out;
}

/**
 * When `IncludeFields` is set, Autotask requires `id` for paging past 500 rows.
 * @param {object} [body] - Parsed query body
 * @returns {object|undefined}
 */
export function ensureIncludeFieldsHasIdForPagination(body) {
  if (body == null || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }
  const include = body.IncludeFields;
  if (include == null || !Array.isArray(include)) {
    return {
      ...body,
    };
  }
  const hasId = include.some((f) => String(f).toLowerCase() === "id");
  if (hasId) {
    return {
      ...body,
      IncludeFields: [
        ...include,
      ],
    };
  }
  return {
    ...body,
    IncludeFields: [
      ...include,
      "id",
    ],
  };
}

/**
 * User-facing $summary for list actions (full vs partial pagination).
 * @param {object} opts
 * @param {number} opts.total
 * @param {string} opts.resourceLabel - e.g. `ticket(s)` or `companies`
 * @param {boolean} opts.stoppedEarly
 * @param {number} opts.maxPages
 */
export function formatListActionSummary({
  total, resourceLabel, stoppedEarly, maxPages,
}) {
  if (stoppedEarly) {
    return (
      `Retrieved ${total} ${resourceLabel} (partial: pagination capped at ` +
      `${maxPages} pages; use filters or narrow the query)`
    );
  }
  return `Retrieved ${total} ${resourceLabel}`;
}
