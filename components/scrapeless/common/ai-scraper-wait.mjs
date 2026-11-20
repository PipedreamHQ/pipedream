import { setTimeout as sleep } from "node:timers/promises";
import { ConfigurationError } from "@pipedream/platform";
import { assertAiScraperResultResponse } from "./ai-scraper-response.mjs";

/**
 * Validate the polling budget before creating a billable task.
 *
 * @param {number} seconds Maximum polling time, excluding task creation.
 * @returns {number} Validated integer budget in seconds.
 * @throws {ConfigurationError} If the budget is outside the supported range.
 */
export function validateAiScraperWaitSeconds(seconds) {
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > 240) {
    throw new ConfigurationError("Max Wait Seconds must be an integer from 1 to 240.");
  }
  return seconds;
}

/**
 * Poll one existing task without creating or replacing any task.
 * Preserve terminal API data; return an explicit local timeout with recovery ID.
 *
 * @param {object} options Polling dependencies and limits.
 * @param {string} options.taskId Validated ID returned by task creation.
 * @param {Function} options.getResult App callback accepting timeout and AbortSignal.
 * @param {number} options.maxWaitSeconds Validated polling budget in seconds.
 * @param {Function} [options.now] Clock in milliseconds for deadline calculation.
 * @param {Function} [options.wait] Asynchronous delay function.
 * @returns {Promise<object>} Terminal response with task_id, or timeout details.
 * @throws {Error} If the API or transport fails, or its response is malformed.
 */
export async function pollAiScraperResult({
  taskId, getResult, maxWaitSeconds, now = Date.now, wait = sleep,
}) {
  const deadline = now() + validateAiScraperWaitSeconds(maxWaitSeconds) * 1000;
  let lastResponse;
  while (now() < deadline) {
    const remaining = deadline - now();
    if (remaining <= 0) break;
    let delay = 5000;
    let response;
    let rateLimited = false;
    const timeout = Math.min(30000, remaining);
    const controller = new AbortController();
    const timer = setTimeout(
      /**
       * Cancel the current query when its request budget expires.
       *
       * @returns {void}
       */
      () => controller.abort(),
      timeout,
    );
    try {
      response = await getResult({
        timeout,
        signal: controller.signal,
      });
    } catch (error) {
      if (error.response?.status === 429) {
        rateLimited = true;
        const retryAfter = error.response.headers?.["retry-after"];
        if (retryAfter !== undefined) {
          const seconds = Number(retryAfter);
          const retryMs = Number.isFinite(seconds) && seconds >= 0
            ? seconds * 1000
            : Date.parse(retryAfter) - now();
          if (Number.isFinite(retryMs)) delay = Math.max(delay, retryMs);
        }
      } else if (!(now() >= deadline && [
        "ECONNABORTED",
        "ETIMEDOUT",
        "ERR_CANCELED",
      ].includes(error.code))) {
        throw error;
      }
    } finally {
      clearTimeout(timer);
    }
    if (now() >= deadline) break;
    if (!rateLimited) {
      assertAiScraperResultResponse(response);
      if (response.task_id !== undefined && response.task_id !== taskId) {
        throw new Error("AI Scraper result contains a different task ID. Keep the original task ID for investigation.");
      }
      lastResponse = response;
      if ([
        "success",
        "failed",
      ].includes(response.status)) {
        return {
          ...response,
          task_id: taskId,
        };
      }
    }
    if (delay >= deadline - now()) break;
    await wait(delay);
  }
  return {
    status: "timeout",
    task_id: taskId,
    ...(lastResponse !== undefined && {
      last_response: lastResponse,
    }),
  };
}
