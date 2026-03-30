import { ConfigurationError } from "@pipedream/platform";

/**
 * Builds the POST body for `/V1.0/{Entity}/query`. When the UI sends `filter` as
 * a JSON string (e.g. object builder with a text value), Autotask returns 500
 * unless it is parsed into an array. The whole body may also be a JSON string.
 *
 * @param {object|string} [data] - Body or JSON string of same shape
 * @returns {object|undefined} - Shallow clone with normalized `filter`
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
  if (typeof body !== "object" || body == null || Array.isArray(body)) {
    return body;
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
