export const PAYMOS_DEFAULT_BASE_URL = "https://api.paymos.io";

export function parseProblemDetails(rawBody) {
  if (rawBody === undefined || rawBody === null) {
    return null;
  }
  if (typeof rawBody === "object" && !Array.isArray(rawBody)) {
    return rawBody;
  }
  if (typeof rawBody !== "string" || rawBody.trim() === "") {
    return null;
  }
  try {
    const parsed = JSON.parse(rawBody);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export class PaymosApiError extends Error {
  constructor(status, responseBody) {
    const rawText = typeof responseBody === "string"
      ? responseBody
      : responseBody !== undefined && responseBody !== null
        ? JSON.stringify(responseBody)
        : "";
    const problem = parseProblemDetails(rawText);
    const detail = (typeof problem?.detail === "string" && problem.detail !== "")
      ? problem.detail
      : (typeof problem?.code === "string" && problem.code !== "")
        ? problem.code
        : (typeof problem?.title === "string" && problem.title !== "")
          ? problem.title
          : rawText || "Empty response";

    super(`Paymos API ${status}: ${detail}`);
    this.name = "PaymosApiError";
    this.status = status;
    this.type = typeof problem?.type === "string" ? problem.type : null;
    this.title = typeof problem?.title === "string" ? problem.title : null;
    this.code = typeof problem?.code === "string" ? problem.code : "";
    this.detail = detail;
    this.field = typeof problem?.field === "string" ? problem.field : null;
    this.errors = Array.isArray(problem?.errors)
      ? problem.errors.map((entry) => ({
        code: typeof entry?.code === "string" ? entry.code : "",
        field: typeof entry?.field === "string" ? entry.field : null,
        message: typeof entry?.message === "string" ? entry.message : "",
      }))
      : [];
    this.problem = problem;
    this.responseBody = rawText;
  }
}

export function normalizeBaseUrl(rawValue) {
  let parsed;
  try {
    parsed = new URL(rawValue);
  } catch {
    throw new Error("Paymos API base_url is not a valid URL.");
  }

  const host = parsed.hostname.toLowerCase();
  const isLoopback = host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "[::1]";

  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && isLoopback)) {
    throw new Error(
      "Paymos API base_url must use HTTPS (HTTP is allowed only for loopback tests).",
    );
  }

  return rawValue.replace(/\/+$/, "");
}

export function validatePaymosAuth(auth) {
  if (!auth || typeof auth !== "object") {
    throw new Error("Paymos API credentials are required.");
  }

  const publicKey = String(auth.public_key ?? "").trim();
  const secretKey = String(auth.secret_key ?? "").trim();
  const rawBaseUrl = String(auth.base_url ?? PAYMOS_DEFAULT_BASE_URL).trim() ||
    PAYMOS_DEFAULT_BASE_URL;

  if (!publicKey) {
    throw new Error(
      "Paymos public_key is required (expected pk_live_... or pk_test_...).",
    );
  }

  if (publicKey.startsWith("rk_")) {
    throw new Error(
      "Payout API keys (rk_) are not supported in Paymos Pipedream components. Use a Payment API key starting with pk_live_ (Production) or pk_test_ (Sandbox).",
    );
  }

  let environment;
  if (publicKey.startsWith("pk_live_")) {
    environment = "production";
  } else if (publicKey.startsWith("pk_test_")) {
    environment = "sandbox";
  } else {
    throw new Error(
      "Invalid Paymos public_key prefix. Expected a Payment API key starting with pk_live_ (Production) or pk_test_ (Sandbox).",
    );
  }

  if (!secretKey) {
    throw new Error("Paymos secret_key is required.");
  }

  const baseUrl = normalizeBaseUrl(rawBaseUrl);

  return {
    publicKey,
    secretKey,
    baseUrl,
    environment,
  };
}

export function requireNonEmptyString(value, fieldName) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (trimmed === "") {
    throw new Error(`${fieldName} is required and cannot be empty.`);
  }
  return trimmed;
}

export function parseNonNegativeInteger(value, fieldName) {
  const num = Number(value);
  if (!Number.isSafeInteger(num) || num < 0) {
    throw new Error(`${fieldName} must be a non-negative integer.`);
  }
  return num;
}
