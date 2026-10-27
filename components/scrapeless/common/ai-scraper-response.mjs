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

/**
 * Require a creation response with a usable task ID and no failure status.
 * Missing status is accepted; any supplied status must be recognized.
 *
 * @param {*} response Unmodified creation response from the API.
 * @returns {void}
 * @throws {Error} If the response leaves the creation outcome uncertain.
 */
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

/**
 * Require an object containing a recognized task status, including failed.
 *
 * @param {*} response Unmodified result response from the API.
 * @returns {void}
 * @throws {Error} If the response is not an object with a known status.
 */
export function assertAiScraperResultResponse(response) {
  if (!isPlainObject(response) || !AI_SCRAPER_STATUSES.includes(response.status)) {
    throw new Error("Unexpected AI Scraper result response: expected a known task status. Keep the task ID for further investigation.");
  }
}

/**
 * Describe the reported state without implying an absent result was retrieved.
 *
 * @param {string} taskId Validated task identifier for the summary.
 * @param {object} response API response with a validated status.
 * @returns {string} State-specific summary and the caller's next step.
 * @throws {Error} If called with an unsupported status.
 */
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

/**
 * Replace a transport error without copying request configuration or credentials.
 * Preserve only recognized transport codes and warn against repeating a POST.
 *
 * @param {*} error Original transport failure.
 * @param {object} options Request classification.
 * @param {string} options.method HTTP method used by the failed request.
 * @returns {Error} Safe error describing the appropriate recovery boundary.
 */
export function buildAiScraperTransportError(error, { method }) {
  const safeError = new Error(method === "POST"
    ? "AI Scraper creation request did not complete. A task may have been created, but its outcome is unknown. Do not automatically resubmit the request."
    : "AI Scraper result request did not complete. You can query the same task ID again.");
  if (TRANSPORT_CODES.includes(error?.code)) {
    safeError.code = error.code;
  }
  return safeError;
}

/**
 * Preserve platform runtime context while filtering HTTP diagnostic exports.
 * Omit request configuration; keep status, headers, and original response data.
 *
 * @param {object} [$] Optional Pipedream step context receiving safe exports.
 * @returns {object} Runtime context and the filtered export callback.
 */
export function getAiScraperRequestContext($) {
  return {
    context: $?.context,
    /**
     * Forward response diagnostics without the platform's response.config field.
     *
     * @param {string} key Platform export name.
     * @param {object} response HTTP response supplied by the platform client.
     * @returns {void}
     */
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

/**
 * Remove request configuration and transport references from an HTTP error.
 * Mutate the original error while retaining its status and API response body.
 *
 * @param {object} error HTTP error with an existing response object.
 * @returns {object} Same error after removing configuration, request, and cause.
 */
export function sanitizeAiScraperHttpError(error) {
  delete error.config;
  delete error.request;
  delete error.cause;
  delete error.response.config;
  delete error.response.request;
  return error;
}
