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
  // The window is inclusive of both endpoints, and the API caps it at 365
  // inclusive days (verified: a 365-day *difference* — 366 inclusive days —
  // returns 400, a 364-day difference is accepted). So count inclusive days.
  const inclusiveDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  if (inclusiveDays > MAX_ANALYTICS_RANGE_DAYS) {
    throw new ConfigurationError(`The date range must not exceed ${MAX_ANALYTICS_RANGE_DAYS} days (requested ${inclusiveDays} days).`);
  }
}

function utcTodayYmd() {
  return new Date().toISOString()
    .slice(0, 10);
}

function shiftUtcYmd(ymd, deltaDays) {
  const t = Date.parse(`${ymd}T00:00:00Z`);
  if (Number.isNaN(t)) {
    return ymd; // leave a malformed value for the API to reject
  }
  const d = new Date(t);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

// Resolve the analytics date window into params ready to send.
//
// The Dappier analytics API silently resets BOTH bounds to its default
// trailing-7-day window whenever EITHER `start_date` or `end_date` is omitted,
// discarding the bound the caller actually supplied (verified against the live
// API). So we never forward a one-sided window: we fill the missing bound
// (anchored to the supplied one so it always orders correctly) and send both,
// so a supplied bound is honored. Missing end -> today (UTC); missing start ->
// 6 days before the end, giving a trailing 7-day window. When both are omitted
// we send neither and let the API apply its own default.
export function resolveDateRange(startDate, endDate) {
  if (!startDate && !endDate) {
    return {};
  }
  const end = endDate || utcTodayYmd();
  const start = startDate || shiftUtcYmd(end, -6);
  validateDateRange(start, end);
  return {
    start_date: start,
    end_date: end,
  };
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
