import constants from "./constants.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Retries a single request on 429, honoring the response's Retry-After header (seconds)
   instead of guessing a backoff. Falls through unchanged for any other status/error. */
const withRetryAfter = async (fn, maxRetries = 3) => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.response?.status ?? err?.status;
      if (status !== 429 || attempt >= maxRetries) {
        throw err;
      }
      const retryAfterSeconds = Number(err?.response?.headers?.["retry-after"]);
      await sleep(Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
        ? retryAfterSeconds * 1000
        : constants.RATE_LIMIT_BATCH_DELAY_MS);
    }
  }
};

/* Runs fn over items in small concurrent batches, pausing between batches, so callers
   don't blow through Harvest's rate limit with an unbounded Promise.all. Fails fast: the
   first rejection (after any retries inside fn) propagates immediately and no partial
   results are returned. */
const mapWithRateLimit = async (items, fn, {
  batchSize = constants.RATE_LIMIT_BATCH_SIZE,
  delayMs = constants.RATE_LIMIT_BATCH_DELAY_MS,
} = {}) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    if (i + batchSize < items.length) {
      await sleep(delayMs);
    }
  }
  return results;
};

const removeNullEntries = (obj) =>
  obj && Object.entries(obj).reduce((acc, [
    key,
    value,
  ]) => {
    const isNumber = typeof value === "number";
    const isBoolean = typeof value === "boolean";
    const isNotEmpyString = typeof value === "string" && value.trim() !== "";
    const isNotEmptyArray = Array.isArray(value) && value.length;
    const isNotEmptyObject =
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length !== 0;
    isNotEmptyObject && (value = removeNullEntries(value));
    return ((value || value === false) &&
      (isNotEmpyString || isNotEmptyArray || isNotEmptyObject || isBoolean || isNumber))
      ? {
        ...acc,
        [key]: value,
      }
      : acc;
  }, {});

/* This function checks for date strings with the format YYYY-MM-DD
    examples
    2022-09-28
    2021-12-10
*/
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const date = new Date(dateString);
  if (!dateString) {
    return false;
  }
  if (dateString.match(regex) === null) {
    return false;
  }
  const timestamp = date.getTime();
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return false;
  }
  return date.toISOString().startsWith(dateString);
};

/* This function checks for time strings with the format HH:MM AM/PM
    examples
    11:45PM
    11:45 PM
    11:45 pm
    11:45pm
    11:45AM
    11:45 AM
    11:45 am
    11:45am
*/
const isValidTime = (timeString) => {
  const regex = /([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])\s*([AaPp][Mm])$/;
  return timeString
    ? timeString.match(regex)
    : false;
};

export {
  removeNullEntries, isValidDate, isValidTime, mapWithRateLimit, withRetryAfter,
};
