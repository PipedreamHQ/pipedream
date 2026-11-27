const CHART_URL_PREFIX = /^https?:\/\/[^/]+\/chart\?/i;

/**
 * UrlChart takes the whole legacy query string as a single input. Accept it with
 * or without a leading `?`, pasted straight out of a chart URL, and with the
 * line breaks an editor adds. Spaces are left alone: in `chl`/`chtt` a `+` is a
 * space and a literal space means the same thing.
 */
export const normalizeChartParams = (params = "") => String(params)
  .replace(CHART_URL_PREFIX, "")
  .replace(/^chart\?/i, "")
  .replace(/^[\s?]+/, "")
  .replace(/[\r\n\t]+/g, "")
  .trim();

/**
 * UrlChart explains failures in a JSON body (`{ error, message }`), but image
 * requests ask for bytes, so axios hands that body back as a Buffer.
 */
export const formatErrorDetail = (body) => {
  if (body === undefined || body === null || body === "") {
    return "no response body";
  }
  const text = Buffer.isBuffer(body)
    ? body.toString("utf8")
    : (typeof body === "string"
      ? body
      : JSON.stringify(body));
  try {
    const {
      error, message,
    } = JSON.parse(text);
    return error ?? message ?? text;
  } catch {
    return text;
  }
};
