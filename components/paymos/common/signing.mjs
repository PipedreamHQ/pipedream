import { createHash, createHmac } from "node:crypto";

function rfc3986(value) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export function encodePathSegment(value) {
  return rfc3986(String(value));
}

export function canonicalizeQuery(filters) {
  if (!filters) {
    return "";
  }
  const parts = [];
  for (const key of Object.keys(filters).sort()) {
    const raw = filters[key];
    if (raw === undefined || raw === null) {
      continue;
    }
    const values = Array.isArray(raw) ? [...raw].sort() : [raw];
    if (values.length === 0) {
      throw new TypeError(`Paymos query filter cannot be empty: ${key}`);
    }
    for (const value of values) {
      if ((typeof value !== "string" && typeof value !== "number") || String(value) === "") {
        throw new TypeError(`Invalid Paymos query filter: ${key}`);
      }
      parts.push(`${rfc3986(key)}=${rfc3986(String(value))}`);
    }
  }
  return parts.length === 0 ? "" : `?${parts.join("&")}`;
}

export function sha256Hex(body = "") {
  if (body === undefined || body === null) {
    return "";
  }
  if (typeof body === "string") {
    if (body === "") {
      return "";
    }
    return createHash("sha256").update(body, "utf8").digest("hex");
  }
  if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
    if (body.length === 0) {
      return "";
    }
    return createHash("sha256").update(body).digest("hex");
  }
  throw new TypeError("Paymos request body must be a string or Buffer.");
}

export function stringToSign(timestamp, method, path, query = "", body = "") {
  const bodyHash = sha256Hex(body);
  return `${timestamp}\n${String(method).toUpperCase()}\n${path}\n${query}\n${bodyHash}`;
}

export function sign(secret, value) {
  return createHmac("sha256", secret).update(value, "utf8").digest("base64");
}

export function authorizationHeader(
  apiKey,
  apiSecret,
  timestamp,
  method,
  path,
  query = "",
  body = "",
) {
  const signature = sign(
    apiSecret,
    stringToSign(timestamp, method, path, query, body),
  );
  return `HMAC-SHA256 ${apiKey}:${signature}`;
}

export function signRequest({
  method,
  path,
  query,
  body,
  publicKey,
  secretKey,
  timestamp,
}) {
  const ts = timestamp !== undefined
    ? String(timestamp)
    : String(Math.floor(Date.now() / 1000));
  const queryString = typeof query === "string"
    ? query
    : query !== undefined
      ? canonicalizeQuery(query)
      : "";
  const rawBody = body ?? "";

  return {
    Authorization: authorizationHeader(
      publicKey,
      secretKey,
      ts,
      method,
      path,
      queryString,
      rawBody,
    ),
    "X-Request-Timestamp": ts,
  };
}
