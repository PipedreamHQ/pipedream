import { isPlainObject } from "./utils.mjs";
import { validateAiScraperTaskId } from "./ai-scraper.mjs";

const AI_SCRAPER_STATUSES = [
  "pending",
  "running",
  "success",
  "failed",
];
const TRANSPORT_CODES = [
  "ECONNABORTED",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
  "EPIPE",
  "ERR_NETWORK",
  "ERR_CANCELED",
];

export function assertAiScraperCreateResponse(response) {
  if (isPlainObject(response)) {
    try {
      validateAiScraperTaskId(response.task_id);
      if (response.status === undefined
        || (AI_SCRAPER_STATUSES.includes(response.status) && response.status !== "failed")) {
        return;
      }
    } catch {
      // Invalid API-provided IDs are protocol errors, not user configuration errors.
    }
  }
  throw new Error("Unexpected AI Scraper creation response. A task may have been created, but its outcome is unknown. Do not automatically resubmit the request.");
}

export function assertAiScraperResultResponse(response) {
  if (!isPlainObject(response) || !AI_SCRAPER_STATUSES.includes(response.status)) {
    throw new Error("Unexpected AI Scraper result response: expected a known task status. Keep the task ID for further investigation.");
  }
}

export function getAiScraperResultSummary(taskId, response) {
  switch (response.status) {
  case "pending":
    return `AI Scraper task ${taskId} is pending; query the same task ID later`;
  case "running":
    return `AI Scraper task ${taskId} is running; query the same task ID later`;
  case "failed":
    return `AI Scraper task ${taskId} failed; see the returned message`;
  case "success":
    return response.task_result === undefined || response.task_result === null
      ? `AI Scraper task ${taskId}: API reported success; no result payload was returned`
      : `Retrieved result for AI Scraper task ${taskId}; save it promptly`;
  default:
    throw new Error("Unexpected AI Scraper task status.");
  }
}

export function buildAiScraperTransportError(error, { method }) {
  const safeError = new Error(method === "POST"
    ? "AI Scraper creation request did not complete. A task may have been created, but its outcome is unknown. Do not automatically resubmit the request."
    : "AI Scraper result request did not complete. You can query the same task ID again.");
  if (TRANSPORT_CODES.includes(error?.code)) {
    safeError.code = error.code;
  }
  return safeError;
}

// Platform 3.1.1 exports response.config before rejecting HTTP errors.
// Filter it before forwarding the export, while retaining response diagnostics.
export function getAiScraperRequestContext($) {
  return {
    export(key, response) {
      if ($?.export) {
        $.export(key, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
        });
      }
    },
  };
}

export function sanitizeAiScraperHttpError(error) {
  delete error.config;
  delete error.request;
  delete error.cause;
  delete error.response.config;
  delete error.response.request;
  return error;
}
