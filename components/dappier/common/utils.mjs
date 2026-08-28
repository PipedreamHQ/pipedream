import { ConfigurationError } from "@pipedream/platform";
import { MAX_ANALYTICS_RANGE_DAYS } from "./constants.mjs";

// Fail fast on an out-of-range window so the user gets a clear message
// instead of a raw API 400. Malformed dates are left to the API to report.
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return;
  }
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return;
  }
  if (end < start) {
    throw new ConfigurationError("End Date must be on or after Start Date.");
  }
  const days = (end - start) / (1000 * 60 * 60 * 24);
  if (days > MAX_ANALYTICS_RANGE_DAYS) {
    throw new ConfigurationError(`The date range must not exceed ${MAX_ANALYTICS_RANGE_DAYS} days (requested ${Math.round(days)} days).`);
  }
}

// Reduce each object in an array to just the requested fields. Returns the
// array unchanged when no fields are requested, so callers stay backwards
// compatible (omitted = full payload).
export function pluckFields(items, fields) {
  if (!Array.isArray(items) || !Array.isArray(fields) || fields.length === 0) {
    return items;
  }
  return items.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }
    const picked = {};
    for (const field of fields) {
      if (Object.hasOwn(item, field)) {
        picked[field] = item[field];
      }
    }
    return picked;
  });
}
