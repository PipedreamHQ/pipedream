// Shared constants + error mapping for the FileToPDF Pipedream components.

export const BASE_URL = "https://api.filetopdf.dev";

// PDF/A archival conformance levels offered as a dropdown. Mirrors the choices in
// the Zapier/Make/n8n integrations so every FileToPDF connector reads the same.
export const PDFA_OPTIONS = [
  "PDF/A-1b",
  "PDF/A-2b",
  "PDF/A-3b",
];

// Error codes that are really an auth/billing/plan condition rather than a bad
// request — surfaced as a Pipedream ConfigurationError so the UI prompts the user
// to reconnect or upgrade instead of showing a generic failure.
export const CONFIG_ERROR_CODES = new Set([
  "missing_api_key",
  "invalid_token",
  "forbidden",
  "payment_required",
  "subscription_required",
  "upgrade_required",
]);

/**
 * Plain-English messages for the error codes worth special-casing. Everything
 * else falls back to the API's own message. Ported verbatim (intent + copy) from
 * the Zapier middleware so the wording stays consistent across integrations.
 */
export function friendlyMessage(code, error = {}, status) {
  switch (code) {
  case "upgrade_required": {
    const param = error.parameter
      ? `The "${error.parameter}" option`
      : "That conversion option";
    return `${param} is only available on the Pro and Scale plans (and the free trial). Upgrade to use conversion options${error.upgrade_url
      ? `: ${error.upgrade_url}`
      : ""}.`;
  }
  case "forbidden_url":
    return "That URL points to a private or internal address, which is not allowed. Use a public http(s) link.";
  case "payment_required":
    return `You're out of credits. Top up or upgrade${error.upgrade_url
      ? ` at ${error.upgrade_url}`
      : " at https://filetopdf.dev/subscription"}.`;
  case "subscription_required":
    return "No active subscription. Activate a plan at https://filetopdf.dev/subscription to run conversions.";
  case "concurrency_limit":
    return `Your plan allows ${error.concurrent_limit || "a limited number of"} concurrent conversion(s). Upgrade for more, or retry in a moment.`;
  case "file_too_large":
    return "File too large — the maximum is 30 MB.";
  case "missing_api_key":
  case "forbidden":
    return "Invalid or missing API key. Reconnect your FileToPDF account.";
  default:
    return error.message || `Request failed with status ${status}.`;
  }
}
