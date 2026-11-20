import crypto from "crypto";

/**
 * Leaves out arguments that were not set (and empty lists), so Quilt's defaults apply.
 * An empty string is kept: it means "clear" (e.g. an empty assignee unassigns a task).
 * @param {object} args
 * @returns {object}
 */
function cleanArgs(args = {}) {
  return Object.fromEntries(Object.entries(args)
    .filter(([
      , value,
    ]) => value !== undefined && value !== null && !(Array.isArray(value) && !value.length)));
}

/**
 * A JSON object given as an object or as a JSON string.
 * @param {object|string} value
 * @returns {object}
 */
function parseObject(value) {
  if (value === undefined || value === null || value === "") return {};
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = undefined;
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Arguments must be a JSON object, e.g. `{ \"path\": \"src/\" }`");
  }
  return parsed;
}

/**
 * The JSON-RPC message with this id from an MCP response, which is either JSON or a
 * text/event-stream body of `data:` lines. A response with no reply to this id (another
 * id, only notifications, or cut short) throws rather than passing as an empty result.
 * @param {object|string} response
 * @param {number} id
 * @returns {object}
 */
function rpcMessage(response, id) {
  if (typeof response !== "string") {
    // An error the server could not tie to a request comes back with a null id: pass it on.
    const isReply = response?.id === id || (response?.error && response.id == null);
    if (!isReply) throw new Error("Quilt: the response had no reply to this request");
    return response;
  }
  const messages = response.split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => {
      try {
        return JSON.parse(line.slice(5).trim());
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const reply = messages.find((m) => m.id === id);
  if (!reply) throw new Error("Quilt: the response had no reply to this request");
  return reply;
}

/**
 * A stable dedupe id of at most 64 characters: the SHA-256 hex digest of the parts.
 * @param {...string} parts
 * @returns {string}
 */
function hashId(...parts) {
  return crypto.createHash("sha256").update(parts.join(":"))
    .digest("hex");
}

/**
 * Whether a Quilt webhook POST is genuine: `x-quilt-signature` is
 * `sha256=HMAC-SHA256(secret, "<x-quilt-timestamp>.<raw body>")`, and the timestamp
 * (milliseconds) is within `toleranceMs` of now.
 * @returns {boolean}
 */
function isSignedByQuilt({
  secret, timestamp, signature, bodyRaw, toleranceMs, now = Date.now(),
}) {
  if (!secret || !timestamp || !signature || typeof bodyRaw !== "string") return false;
  if (Math.abs(now - Number(timestamp)) > toleranceMs) return false;
  const want = Buffer.from("sha256=" + crypto.createHmac("sha256", secret).update(`${timestamp}.${bodyRaw}`)
    .digest("hex"));
  const got = Buffer.from(String(signature));
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}

/**
 * A new signing secret for a webhook subscription.
 * @returns {string}
 */
function newSecret() {
  return crypto.randomBytes(24).toString("hex");
}

/**
 * A request header's value, whatever its case, or "".
 * @param {object} headers
 * @param {string} name lowercase header name
 * @returns {string}
 */
function header(headers, name) {
  const key = Object.keys(headers || {}).find((k) => k.toLowerCase() === name);
  return key
    ? String(headers[key])
    : "";
}

export default {
  cleanArgs,
  header,
  newSecret,
  parseObject,
  rpcMessage,
  hashId,
  isSignedByQuilt,
};
