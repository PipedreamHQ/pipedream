import { ConfigurationError } from "@pipedream/platform";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Parse a `YYYY-MM-DD` calendar date as UTC midnight, in Unix milliseconds.
 */
const dateToUtcStartMs = (value, label = "Date") => {
  const ms = DATE_PATTERN.test(value ?? "")
    ? Date.parse(`${value}T00:00:00.000Z`)
    : NaN;
  if (Number.isNaN(ms)) {
    throw new ConfigurationError(`${label} must be a calendar date in \`YYYY-MM-DD\` format, e.g. \`2026-01-31\`. Received: \`${value}\``);
  }
  return ms;
};

/**
 * Exclusive end of a `YYYY-MM-DD` calendar date in UTC (midnight of the next day).
 */
const dateToUtcEndExclusiveMs = (value, label = "Date") =>
  dateToUtcStartMs(value, label) + DAY_MS;

/**
 * Today's calendar date (`YYYY-MM-DD`) in the given IANA time zone.
 */
const getTodayInTimeZone = (timeZone = "UTC", now = new Date()) => {
  let formatted;
  try {
    // en-US with 2-digit parts formats as `MM/DD/YYYY`
    formatted = now.toLocaleDateString("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    throw new ConfigurationError(`Invalid time zone \`${timeZone}\`. Use an IANA time zone name, e.g. \`Europe/Berlin\` or \`America/New_York\`.`);
  }
  const [
    month,
    day,
    year,
  ] = formatted.split("/");
  return `${year}-${month}-${day}`;
};

/**
 * Yesterday's calendar date (`YYYY-MM-DD`) in the given IANA time zone.
 * Subtracts one calendar day, so daylight saving changes do not skip or repeat a date.
 */
const getYesterdayInTimeZone = (timeZone = "UTC", now = new Date()) => {
  const todayMs = dateToUtcStartMs(getTodayInTimeZone(timeZone, now));
  return new Date(todayMs - DAY_MS).toISOString()
    .slice(0, 10);
};

export default {
  DATE_PATTERN,
  dateToUtcStartMs,
  dateToUtcEndExclusiveMs,
  getTodayInTimeZone,
  getYesterdayInTimeZone,
};
