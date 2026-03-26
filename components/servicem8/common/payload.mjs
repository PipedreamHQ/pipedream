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
 * For API body fields documented as string flags `"1"` / `"0"` (e.g. `is_primary_contact`).
 * @param {boolean|undefined|null} v
 * @returns {"1"|"0"|undefined}
 */
export function optionalBool10String(v) {
  if (v === undefined || v === null) return undefined;
  return v
    ? "1"
    : "0";
}

/**
 * Optional float fields for API bodies. Omits blank or invalid values.
 * @param {unknown} v
 * @returns {number|undefined}
 */
export function optionalParsedFloat(v) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const s = String(v).trim();
  if (s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n)
    ? n
    : undefined;
}

/**
 * Optional integer body fields (e.g. travel seconds/meters, automation flags).
 * @param {unknown} v
 * @returns {number|undefined}
 */
export function optionalParsedInt(v) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  const s = String(v).trim();
  if (s === "") return undefined;
  const n = Number.parseInt(s, 10);
  return Number.isNaN(n)
    ? undefined
    : n;
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

/** Allowed `outputFormat` values for `platform_produce_document`. */
const PRODUCE_OUTPUT_FORMATS = new Set([
  "pdf",
  "docx",
  "jpg",
]);

/**
 * Pipedream props sometimes arrive as `{ value, label }` or nested; coerce to a plain string.
 * @param {unknown} v
 * @returns {string}
 */
export function coercePipedreamString(v) {
  if (v == null) {
    return "";
  }
  if (Array.isArray(v)) {
    return v
      .map(coercePipedreamString)
      .filter((s) => s !== "")
      .join("\n")
      .trim();
  }
  if (typeof v === "object" && v !== null && "value" in v) {
    return coercePipedreamString(/** @type {{ value?: unknown }} */ (v).value);
  }
  return String(v).trim();
}

/**
 * @param {unknown} raw
 * @returns {"pdf"|"docx"|"jpg"}
 */
export function normalizeProduceOutputFormat(raw) {
  const s = coercePipedreamString(raw).toLowerCase();
  return PRODUCE_OUTPUT_FORMATS.has(s)
    ? /** @type {"pdf"|"docx"|"jpg"} */ (s)
    : "pdf";
}

/**
 * Build the exact JSON body for `POST /platform_produce_document` (explicit string + Content-Type).
 * @param {object} opts
 * @returns {string}
 */
export function buildProduceDocumentJsonBody({
  objectType,
  objectUUID,
  templateType,
  templateUUID,
  outputFormat,
  storeToDiary,
}) {
  const ou = coercePipedreamString(objectUUID);
  if (!ou) {
    throw new Error(
      "objectUUID is empty: set Job / object UUID (Pipedream may pass { value, label } — use the value or bind a string).",
    );
  }
  const body = {
    objectType: coercePipedreamString(objectType) || "Job",
    objectUUID: ou,
    templateType: coercePipedreamString(templateType),
    outputFormat: normalizeProduceOutputFormat(outputFormat),
  };
  const tu = coercePipedreamString(templateUUID);
  if (tu) {
    body.templateUUID = tu;
  }
  if (storeToDiary !== undefined && storeToDiary !== null) {
    body.storeToDiary = Boolean(storeToDiary);
  }
  return JSON.stringify(body);
}

/**
 * Parse JSON error body from a failed produce-document response (`responseType: arraybuffer`).
 * @param {import("axios").AxiosResponse} res
 * @returns {string}
 */
export function errorMessageFromProduceDocumentResponse(res) {
  if (!res || res.status < 400) {
    return "";
  }
  const raw = res.data;
  const buf = Buffer.isBuffer(raw)
    ? raw
    : Buffer.from(raw ?? []);
  const text = buf.toString("utf8").trim();
  try {
    const j = JSON.parse(text);
    if (typeof j.message === "string" && j.message) {
      return j.message;
    }
    if (j.errorCode != null) {
      return `errorCode ${j.errorCode}`;
    }
  } catch {
    // ignore
  }
  return text || `HTTP ${res.status}`;
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
