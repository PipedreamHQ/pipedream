import { ConfigurationError } from "@pipedream/platform";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Parse a `YYYY-MM-DD` calendar date as UTC midnight, in Unix milliseconds.
 * Rejects dates that do not exist, such as `2026-02-29` or `2026-04-31`,
 * which `Date.parse` would otherwise roll over into the next month.
 */
const dateToUtcStartMs = (value, label = "Date") => {
  const ms = DATE_PATTERN.test(value ?? "")
    ? Date.parse(`${value}T00:00:00.000Z`)
    : NaN;
  if (Number.isNaN(ms) || new Date(ms).toISOString()
    .slice(0, 10) !== value) {
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
 * Shift a `YYYY-MM-DD` calendar date by whole days.
 * E.g. `addDays("2026-03-01", -1)` is `2026-02-28`.
 * Works on UTC calendar dates, so daylight saving changes do not skip or repeat a date.
 */
const addDays = (value, days) =>
  new Date(dateToUtcStartMs(value) + days * DAY_MS).toISOString()
    .slice(0, 10);

/**
 * Yesterday's calendar date (`YYYY-MM-DD`) in the given IANA time zone.
 */
const getYesterdayInTimeZone = (timeZone = "UTC", now = new Date()) =>
  addDays(getTodayInTimeZone(timeZone, now), -1);

/**
 * Build the `contributorIds` request value for Create Project and Update Project.
 * The API reads `null` as "everyone on the team", `[]` as "nobody" and an omitted
 * field as "keep the current list" (on create: everyone).
 * @param {object} options
 * @param {string} [options.access] - `everyone`, `selected` or unset
 * @param {string[]} [options.ids] - The contributors for `selected`
 * @returns {string[]|null|undefined} The value to send; `undefined` omits the field
 */
const buildContributorIds = ({
  access, ids,
}) => {
  if (access === "everyone") {
    if (ids?.length) {
      throw new ConfigurationError("Leave Contributors empty when Contributor Access is `everyone`, or set Contributor Access to `selected`.");
    }
    return null;
  }
  if (access === "selected") {
    return ids ?? [];
  }
  return ids;
};

export default {
  DATE_PATTERN,
  addDays,
  buildContributorIds,
  dateToUtcStartMs,
  dateToUtcEndExclusiveMs,
  getTodayInTimeZone,
  getYesterdayInTimeZone,
};
