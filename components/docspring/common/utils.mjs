import crypto from "crypto";
import {
  ConfigurationError, getFileStreamAndMetadata,
} from "@pipedream/platform";
import constants from "./constants.mjs";

const {
  DEFAULT_MAX_RESULTS,
  MAX_BASE64_DOCUMENT_BYTES,
  RECORD_KINDS,
  SOURCE_PDF_TYPES,
  SUBMISSION_FAILURE_STATES,
  TEMPLATE_DOCUMENT_FAILURE_STATES,
  TEMPLATE_FILTERABLE_RESOURCES,
} = constants;

/**
 * True for the values an optional input leaves behind when it's blank.
 * @param {*} value
 * @returns {boolean}
 */
const isBlank = (value) => value === undefined
  || value === null
  || (typeof value === "string" && value.trim() === "")
  || (Array.isArray(value) && value.length === 0);

const isPlainObject = (value) => value !== null
  && typeof value === "object"
  && !Array.isArray(value);

/**
 * Parses a JSON string, or returns a value that isn't a string as it is.
 * @param {*} value
 * @param {string} label - the input's label, for the error message
 * @returns {*}
 */
const parseJson = (value, label) => {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new ConfigurationError(`${label} isn't valid JSON: ${error.message}`);
  }
};

/**
 * Reads an object input: an object, or a JSON object as a string. Blank gives `undefined`.
 * @param {*} value
 * @param {string} label
 * @returns {object|undefined}
 */
const parseObject = (value, label) => {
  if (isBlank(value)) {
    return undefined;
  }
  const parsed = parseJson(value, label);
  if (!isPlainObject(parsed)) {
    throw new ConfigurationError(`${label} must be a JSON object, e.g. \`{"key": "value"}\``);
  }
  return parsed;
};

/**
 * Reads a list of objects: a JSON array as a string, or an array whose items are objects,
 * JSON objects as strings, or JSON arrays of objects (spread into the list). Blank gives
 * `undefined`.
 * @param {*} value
 * @param {string} label
 * @returns {object[]|undefined}
 */
const parseObjectArray = (value, label) => {
  if (isBlank(value)) {
    return undefined;
  }
  const parsed = parseJson(value, label);
  const items = Array.isArray(parsed)
    ? parsed
    : [
      parsed,
    ];
  const result = [];
  items.forEach((item, index) => {
    if (isBlank(item)) {
      return;
    }
    const parsedItem = parseJson(item, `${label} item ${index + 1}`);
    const objects = Array.isArray(parsedItem)
      ? parsedItem
      : [
        parsedItem,
      ];
    for (const object of objects) {
      if (!isPlainObject(object)) {
        throw new ConfigurationError(`Each item in ${label} must be a JSON object, e.g. \`{"key": "value"}\``);
      }
      result.push(object);
    }
  });
  return result.length
    ? result
    : undefined;
};

/**
 * Reads a list of strings: an array, a JSON array as a string, or one comma- or
 * newline-separated string. Blank items are dropped; blank gives `undefined`.
 * @param {*} value
 * @returns {string[]|undefined}
 */
const parseStringArray = (value) => {
  if (isBlank(value)) {
    return undefined;
  }
  let items = value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    items = trimmed.startsWith("[")
      ? parseJson(trimmed, "The list")
      : trimmed.split(/[\n,]/);
  }
  if (!Array.isArray(items)) {
    items = [
      items,
    ];
  }
  const result = items.map((item) => String(item).trim()).filter(Boolean);
  return result.length
    ? result
    : undefined;
};

/**
 * Converts `true`/`false` or their strings to a boolean. Blank gives `undefined`.
 * @param {*} value
 * @param {string} label
 * @returns {boolean|undefined}
 */
const toBoolean = (value, label) => {
  if (isBlank(value)) {
    return undefined;
  }
  if (typeof value === "boolean") {
    return value;
  }
  const text = String(value).trim()
    .toLowerCase();
  if (text === "true") {
    return true;
  }
  if (text === "false") {
    return false;
  }
  throw new ConfigurationError(`${label} must be \`true\` or \`false\`, not \`${value}\``);
};

/**
 * Converts an integer or a string of digits to an integer. Blank gives `undefined`.
 * @param {*} value
 * @param {string} label
 * @returns {number|undefined}
 */
const toInteger = (value, label) => {
  if (isBlank(value)) {
    return undefined;
  }
  const number = typeof value === "number"
    ? value
    : Number(String(value).trim());
  if (!Number.isInteger(number)) {
    throw new ConfigurationError(`${label} must be a whole number, not \`${value}\``);
  }
  return number;
};

/**
 * Reads a Max Results input: a whole number of at least 1, or the default when blank.
 * @param {*} value
 * @returns {number}
 */
const maxResults = (value) => {
  const number = toInteger(value, "Max Results");
  if (number === undefined) {
    return DEFAULT_MAX_RESULTS;
  }
  if (number < 1) {
    throw new ConfigurationError(`Max Results must be at least 1, not \`${value}\``);
  }
  return number;
};

/**
 * Removes the keys whose values are blank (`undefined`, `null`, `""` or `[]`), so optional
 * inputs that weren't filled in aren't sent.
 * @param {object} object
 * @returns {object}
 */
const compact = (object) => Object.fromEntries(
  Object.entries(object).filter(([
    , value,
  ]) => !isBlank(value)),
);

/**
 * An ID for a request path, trimmed and percent-encoded so it can only name one record.
 * A blank ID, `.` or `..` would send the request to a different endpoint, so they throw
 * before any request is made.
 * @param {*} value - the ID
 * @param {string} label - the input's name, for the error message, e.g. `Submission ID`
 * @returns {string}
 */
const pathId = (value, label) => {
  const id = isBlank(value)
    ? ""
    : String(value).trim();
  if (!id) {
    throw new ConfigurationError(`${label} is required`);
  }
  if (id === "." || id === "..") {
    throw new ConfigurationError(`\`${id}\` isn't a valid ${label}`);
  }
  return encodeURIComponent(id);
};

/**
 * The submission lists' `test` filter for a mode of `any`, `live` or `test`.
 * @param {string} [mode]
 * @returns {boolean|undefined}
 */
const testFilter = (mode) => {
  if (mode === "live") {
    return false;
  }
  if (mode === "test") {
    return true;
  }
  return undefined;
};

/**
 * A folder input's value for the API: `root` is the root folder (`null`).
 * @param {string} [folderId]
 * @returns {string|null|undefined}
 */
const folderValue = (folderId) => {
  if (isBlank(folderId)) {
    return undefined;
  }
  return String(folderId).trim() === "root"
    ? null
    : folderId;
};

const recordLines = (error) => Object.entries(RECORD_KINDS)
  .filter(([
    key,
  ]) => error[key])
  .map(([
    key,
    kind,
  ]) => `${kind.noun}: ${error[key]}`);

const pollingTimeoutMessage = (error) => {
  const [
    key,
  ] = Object.keys(RECORD_KINDS).filter((k) => error[k]);
  if (!key) {
    return "The PDF wasn't ready in time.";
  }
  const kind = RECORD_KINDS[key];
  if (key === "template_id") {
    return `The template's PDF wasn't processed in time. Get it later with ${kind.getAction} (${error[key]}).`;
  }
  return `The PDF wasn't ready in time. Get it later with ${kind.getAction} (${error[key]}), or use the ${kind.event} trigger.`;
};

const legacyErrorText = (data) => {
  if (typeof data === "string") {
    return data.trim().slice(0, 500);
  }
  if (!isPlainObject(data)) {
    return "";
  }
  if (typeof data.error === "string") {
    return data.error;
  }
  if (Array.isArray(data.errors)) {
    return data.errors.map((e) => (typeof e === "string"
      ? e
      : JSON.stringify(e))).join("; ");
  }
  if (typeof data.message === "string") {
    return data.message;
  }
  return "";
};

/**
 * The message for a failed DocSpring API request: the error's code and message, one line
 * per detail, the record it's about and the request ID.
 * @param {object} opts
 * @param {number} opts.status - the HTTP status
 * @param {string} [opts.statusText]
 * @param {*} [opts.data] - the response body
 * @param {boolean} [opts.selfHosted] - whether the request went to a self-hosted server
 * @returns {string}
 */
const formatApiError = ({
  status, statusText, data, selfHosted,
}) => {
  const error = isPlainObject(data) && isPlainObject(data.error)
    ? data.error
    : null;
  if (!error || typeof error.code !== "string") {
    if (status === 404 && selfHosted) {
      return "This DocSpring server doesn't have API v2 yet. Upgrade it to the latest release.";
    }
    const text = legacyErrorText(data) || statusText || "Request failed";
    return `DocSpring API error ${status}: ${text}`;
  }
  const lines = [];
  if (error.code === "polling_timeout") {
    lines.push(pollingTimeoutMessage(error));
  } else {
    lines.push(`DocSpring API error ${status} ${error.code}: ${error.message}`);
    for (const detail of Array.isArray(error.details)
      ? error.details
      : []) {
      const where = detail.pointer || detail.parameter;
      const record = detail.submission_id
        ? ` (submission ${detail.submission_id})`
        : "";
      lines.push(`${where
        ? `${where}: `
        : ""}${detail.message}${record}`);
    }
    lines.push(...recordLines(error));
  }
  if (error.request_id) {
    lines.push(`Request ID: ${error.request_id}`);
  }
  return lines.join("\n");
};

/**
 * Why a submission, combined PDF, batch or template came back failed from a request that
 * waited for it, or `null` when it didn't fail.
 * @param {string} kind - `submission`, `combined_pdf`, `submission_batch` or `template`
 * @param {object} record - the API's response
 * @returns {string|null}
 */
const failureMessage = (kind, record) => {
  if (!isPlainObject(record)) {
    return null;
  }
  if (kind === "submission" && SUBMISSION_FAILURE_STATES.includes(record.state)) {
    return `Submission ${record.id} failed (state: ${record.state}): ${record.error_message || "no error message"}`;
  }
  if (kind === "combined_pdf" && record.state === "error") {
    return `Combined PDF ${record.id} failed (state: error): ${record.error_message || "no error message"}`;
  }
  if (kind === "submission_batch" && record.state === "error") {
    const failed = (record.submissions || [])
      .filter((s) => SUBMISSION_FAILURE_STATES.includes(s.state) || s.state === "invalid_data")
      .slice(0, 5)
      .map((s) => `${s.id} (${s.state}): ${s.error_message || "no error message"}`);
    return `Submission batch ${record.id} failed (state: error): ${record.error_count} of ${record.total_count} submissions failed`
      + (failed.length
        ? `\n${failed.join("\n")}`
        : "");
  }
  if (kind === "template") {
    const document = record.document;
    if (isPlainObject(document) && TEMPLATE_DOCUMENT_FAILURE_STATES.includes(document.state)) {
      return `Template ${record.id}'s PDF failed (state: ${document.state}): ${document.error_message || "no error message"}`;
    }
  }
  return null;
};

/**
 * Why a file that Generate Submission Files asked for failed, or `null`.
 * @param {object} submission
 * @param {string[]} formats
 * @returns {string|null}
 */
const fileFailureMessage = (submission, formats) => {
  const files = (submission && submission.files) || {};
  for (const format of formats) {
    const file = files[format];
    if (file && file.state === "error") {
      return `Submission ${submission.id}'s ${format} file failed (state: error): ${file.error_message || "no error message"}`;
    }
  }
  return null;
};

/**
 * Builds a combined PDF source from an input object, with only the properties its type takes.
 * @param {object} source
 * @param {number} index
 * @returns {object}
 */
const toSourcePdf = (source, index) => {
  const where = `Source PDF ${index + 1}`;
  const { type } = source;
  if (!SOURCE_PDF_TYPES.includes(type)) {
    throw new ConfigurationError(`${where} needs a \`type\` of ${SOURCE_PDF_TYPES.map((t) => `\`${t}\``).join(", ")}`);
  }
  if (type !== "template" && (source.template_version !== undefined || source.processed !== undefined)) {
    throw new ConfigurationError(`${where}: \`template_version\` and \`processed\` only apply to \`template\` sources`);
  }
  if (type === "url") {
    if (isBlank(source.url)) {
      throw new ConfigurationError(`${where} is a \`url\` source, so it needs a \`url\``);
    }
    return {
      type,
      url: source.url,
    };
  }
  if (isBlank(source.id)) {
    throw new ConfigurationError(`${where} is a \`${type}\` source, so it needs an \`id\``);
  }
  return compact({
    type,
    id: source.id,
    template_version: type === "template"
      ? source.template_version
      : undefined,
    processed: type === "template"
      ? toBoolean(source.processed, `${where} processed`)
      : undefined,
  });
};

const tooLargeMessage = (bytes) => `The PDF is ${(bytes / 1024 / 1024).toFixed(1)} MB: DocSpring takes files up to 7 MB this way.`
  + " Use a public https:// URL for a larger PDF (up to 100 MB).";

/**
 * The request properties for a template's PDF: a public `https://` URL is sent as
 * `document_url` for DocSpring to download; a file in `/tmp` (or another URL) is read and
 * sent as `document_base64` with its `filename`.
 * @param {string} document - a URL or a path in `/tmp`
 * @param {string} [filename] - the file name to use instead of the file's own
 * @returns {Promise<object>}
 */
const documentParams = async (document, filename) => {
  const ref = isBlank(document)
    ? ""
    : String(document).trim();
  if (!ref) {
    throw new ConfigurationError("Add the PDF: a public `https://` URL, e.g. `https://example.com/form.pdf`, or a file in `/tmp`, e.g. `/tmp/form.pdf`");
  }
  if (/^https:\/\//i.test(ref)) {
    return compact({
      document_url: ref,
      filename,
    });
  }
  const {
    stream, metadata,
  } = await getFileStreamAndMetadata(ref);
  if (metadata.size > MAX_BASE64_DOCUMENT_BYTES) {
    stream.destroy();
    throw new ConfigurationError(tooLargeMessage(metadata.size));
  }
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  if (buffer.length > MAX_BASE64_DOCUMENT_BYTES) {
    throw new ConfigurationError(tooLargeMessage(buffer.length));
  }
  return {
    document_base64: buffer.toString("base64"),
    filename: isBlank(filename)
      ? metadata.name || ref.split("/").pop()
      : filename,
  };
};

/**
 * The names a signer can be given to fill in, from a template's fields: each name once,
 * without static fields, `combined` fields or `@@` submission details, which take no value.
 * @param {object[]} fields - the template's fields
 * @returns {string[]}
 */
const signerFieldNames = (fields) => {
  const names = [];
  for (const field of fields || []) {
    const name = field && field.name;
    if (!name
      || field.static
      || field.type === "combined"
      || name.startsWith("@@")
      || names.includes(name)) {
      continue;
    }
    names.push(name);
  }
  return names;
};

/**
 * The chosen events that a webhook's template filter can't apply to (anything but submission,
 * signature request and template events), in the order they were chosen.
 * @param {string[]} [eventTypes]
 * @returns {string[]}
 */
const eventsTemplatesCantFilter = (eventTypes) => (eventTypes || [])
  .filter((eventType) => !TEMPLATE_FILTERABLE_RESOURCES.includes(String(eventType).split(".")[0]));

/**
 * A request header's value, whatever the case of its name. Repeated headers are joined with
 * commas.
 * @param {object} [headers]
 * @param {string} name - the header's name in lower case
 * @returns {string|undefined}
 */
const headerValue = (headers, name) => {
  const key = Object.keys(headers || {}).find((k) => k.toLowerCase() === name);
  const value = key === undefined
    ? undefined
    : headers[key];
  return Array.isArray(value)
    ? value.join(",")
    : value;
};

/**
 * How many seconds a 429's `Retry-After` header says to wait: a whole number of at least 1,
 * and 1 when the header is missing or isn't a number.
 * @param {object} [headers] - the response headers
 * @returns {number}
 */
const retryAfterSeconds = (headers) => {
  const seconds = Number(headerValue(headers, "retry-after"));
  return Number.isFinite(seconds)
    ? Math.max(1, Math.ceil(seconds))
    : 1;
};

/**
 * Whether a webhook delivery's `X-DocSpring-Signature` header (`t=<timestamp>,v1=<hex>`, with
 * one or more `v1`) matches the HMAC-SHA256 of `"<t>.<raw body>"` with the webhook's secret.
 * Any matching `v1` passes; the comparison is constant-time.
 * @param {object} opts
 * @param {string} opts.secret - the webhook's `secret`
 * @param {string} [opts.header] - the `X-DocSpring-Signature` header
 * @param {string|Buffer} [opts.rawBody] - the request body exactly as received
 * @returns {boolean}
 */
const verifySignature = ({
  secret, header, rawBody,
}) => {
  if (isBlank(header) || (typeof rawBody !== "string" && !Buffer.isBuffer(rawBody))) {
    return false;
  }
  let timestamp;
  const signatures = [];
  for (const part of String(header).split(",")) {
    const index = part.indexOf("=");
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (index < 1 || !value) {
      continue;
    }
    if (key === "t" && timestamp === undefined) {
      timestamp = value;
    } else if (key === "v1") {
      signatures.push(Buffer.from(value));
    }
  }
  if (!timestamp || !signatures.length) {
    return false;
  }
  const expected = Buffer.from(crypto.createHmac("sha256", secret)
    .update(`${timestamp}.`)
    .update(rawBody)
    .digest("hex"));
  return signatures.some((signature) => signature.length === expected.length
    && crypto.timingSafeEqual(signature, expected));
};

/**
 * A version 4 webhook delivery as the source emits it: the event as delivered, plus
 * `resource_type` (the event type before the first dot) and `resource_id` (`data.id`).
 * @param {object} body
 * @returns {object}
 */
const eventOutput = (body) => {
  const eventType = typeof body.event_type === "string"
    ? body.event_type
    : null;
  const data = isPlainObject(body.data)
    ? body.data
    : null;
  return {
    ...body,
    resource_type: eventType
      ? eventType.split(".")[0]
      : null,
    resource_id: data && data.id !== undefined
      ? data.id
      : null,
  };
};

export default {
  isBlank,
  parseJson,
  parseObject,
  parseObjectArray,
  parseStringArray,
  toBoolean,
  toInteger,
  maxResults,
  compact,
  pathId,
  testFilter,
  folderValue,
  formatApiError,
  failureMessage,
  fileFailureMessage,
  toSourcePdf,
  documentParams,
  signerFieldNames,
  eventsTemplatesCantFilter,
  headerValue,
  retryAfterSeconds,
  verifySignature,
  eventOutput,
};
