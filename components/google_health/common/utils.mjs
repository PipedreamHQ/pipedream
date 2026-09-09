import { ConfigurationError } from "@pipedream/platform";
import {
  DATA_TYPES,
  DEFAULT_MAX_RANGE_DAYS,
  TIME_FILTER_FIELD,
  USER,
} from "./constants.mjs";

/**
 * Pure helpers — date arithmetic, unit coercion, filter construction.
 *
 * These live here rather than on the app object because none of them need
 * `this` or the connected account: keeping them free functions means they can
 * be imported and tested directly, without an app instance or a stubbed axios.
 *
 * Everything these throw is a `ConfigurationError`: they run before any request
 * goes out, and every failure is a bad user input rather than a transient fault,
 * so retrying is pointless.
 */

/**
 * Google encodes int64 as a JSON *string*. Every step count, distance,
 * height and sleep-minutes field arrives as text, so an unguarded sum
 * produces string concatenation: "8432" + "7911" === "84327911".
 */
export function int(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const n = Number(value);
  return Number.isFinite(n)
    ? n
    : null;
}

/** Sums after coercion, preserving `null` for "nothing to sum" vs a real zero. */
export function sumInts(values = []) {
  const nums = values
    .map((v) => int(v))
    .filter((v) => v !== null);
  return nums.length
    ? nums.reduce((a, b) => a + b, 0)
    : null;
}

export function round(value, places = 2) {
  const n = int(value);
  if (n === null) {
    return null;
  }
  const factor = 10 ** places;
  return Math.round(n * factor) / factor;
}

/**
 * Parses `YYYY-MM-DD` as a UTC calendar date. Parsing it as local time
 * would shift the day for anyone west of UTC and silently return the
 * wrong date's data.
 */
export function parseDate(date) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date).trim());
  if (!match) {
    throw new ConfigurationError(`Invalid date \`${date}\`. Use \`YYYY-MM-DD\`, e.g. \`2026-08-24\`.`);
  }
  const [
    ,
    year,
    month,
    day,
  ] = match.map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year
    || parsed.getUTCMonth() !== month - 1
    || parsed.getUTCDate() !== day) {
    throw new ConfigurationError(`\`${date}\` is not a real calendar date.`);
  }
  return parsed;
}

export function formatDate(dateObj) {
  return dateObj.toISOString()
    .slice(0, 10);
}

export function addDays(date, days) {
  return formatDate(new Date(parseDate(date).getTime() + (days * 86400000)));
}

export function daysBetween(startDate, endDate) {
  const ms = parseDate(endDate).getTime() - parseDate(startDate).getTime();
  return Math.round(ms / 86400000);
}

/**
 * Today's date in UTC.
 *
 * Deliberately NOT the caller's local date: this runs on Pipedream's servers,
 * so the process timezone is unrelated to the user's, and reading it would
 * substitute one arbitrary timezone for another. The user's true offset is
 * only knowable from their own data (see `resolveUtcOffset` on the app), which
 * costs an API call and needs a date range to probe — the very thing being
 * defaulted here.
 *
 * So the default is UTC, every prop description says so, and every action
 * echoes the dates it actually used so a wrong day is visible rather than
 * silent. Callers who need the user's civil day should pass it explicitly.
 */
export function todayUtc() {
  return new Date().toISOString()
    .slice(0, 10);
}

export function dateOrToday(date) {
  return date || todayUtc();
}

/**
 * Resolves the inclusive date range an action was called with into the
 * closed-open `[start, endExclusive)` the API expects.
 *
 * `rollUpDataTypes` names the types this call will *aggregate*, and only those
 * are range-capped. The 14/90-day limits are documented on
 * `RollUpDataPointsRequest.range` and `DailyRollUpDataPointsRequest.range`
 * alone — `dataPoints.list` has no documented range cap — so applying them to a
 * list-only action refuses queries the API would happily serve. List actions
 * are bounded by their page caps and `truncated` flag instead.
 *
 * Caps are 14 days for `heart-rate`, `active-minutes`, `total-calories` and
 * `calories-in-heart-rate-zone`; 90 for everything else.
 */
export function resolveRange({
  startDate,
  endDate,
  rollUpDataTypes = [],
}) {
  const start = dateOrToday(startDate);
  const end = endDate || start;
  const span = daysBetween(start, end);
  if (span < 0) {
    throw new ConfigurationError(`End Date \`${end}\` is before Start Date \`${start}\`.`);
  }
  const days = span + 1;

  const capped = rollUpDataTypes
    .map((dataType) => ({
      dataType,
      max: DATA_TYPES[dataType]?.maxRangeDays ?? DEFAULT_MAX_RANGE_DAYS,
    }))
    .sort((a, b) => a.max - b.max)[0];
  if (capped && days > capped.max) {
    throw new ConfigurationError(
      `Requested ${days} days (${start} to ${end}) but the Google Health API caps `
      + `aggregated (roll-up) queries for \`${capped.dataType}\` at ${capped.max} days. `
      + "Narrow the date range and call again.",
    );
  }

  return {
    startDate: start,
    endDate: end,
    endExclusive: addDays(end, 1),
    days,
  };
}

/** `2026-08-24` -> `{ date: { year: 2026, month: 8, day: 24 } }` */
export function civilDateTime(date) {
  const parsed = parseDate(date);
  return {
    date: {
      year: parsed.getUTCFullYear(),
      month: parsed.getUTCMonth() + 1,
      day: parsed.getUTCDate(),
    },
  };
}

/**
 * `{ date: { year: 2026, month: 8, day: 24 } }` -> `2026-08-24`.
 *
 * Roll-up results carry `civilStartTime`/`civilEndTime`, not a `date`
 * field — the flat string is what every caller actually wants to key on.
 */
export function civilDateToString(civil) {
  const date = civil?.date;
  if (!date?.year || !date?.month || !date?.day) {
    return null;
  }
  const pad = (n) => String(n)
    .padStart(2, "0");
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

/**
 * The sortable instant a record carries, by record type.
 *
 * `dataPoints.list` documents its order exactly once, at the end of the
 * `filter` parameter: "Data points in the response will be ordered by the
 * interval start time in descending order." Sample types have no interval —
 * `weight`, `height` and `oxygen-saturation` carry `sampleTime` instead — so
 * nothing in the reference actually guarantees their order. Anything that
 * promises newest-first, or reads a "latest" record off the head of the list,
 * sorts on this rather than trusting the server.
 *
 * Values compare as strings: RFC-3339 instants and `YYYY-MM-DD` dates both sort
 * correctly that way, and one record type only ever yields one of the two.
 *
 * FOOD is a catalogue with no time field at all, so it has no order to restore.
 */
const RECORD_TIMESTAMP = {
  INTERVAL: (payload) => payload?.interval?.startTime,
  SESSION: (payload) => payload?.interval?.startTime,
  SAMPLE: (payload) => payload?.sampleTime?.physicalTime,
  DAILY: (payload) => civilDateToString(payload),
  FOOD: () => null,
};

/** `""` for anything undated, so it sorts last under a descending compare. */
export function recordTimestamp(recordType, payload) {
  return RECORD_TIMESTAMP[recordType]?.(payload) ?? "";
}

export function civilInterval(startDate, endExclusive) {
  return {
    start: civilDateTime(startDate),
    end: civilDateTime(endExclusive),
  };
}

/**
 * Builds the AIP-160 time filter for a `list` call. The field name depends
 * on the data type's record type, and civil-time variants are used
 * throughout so no caller needs to know the user's timezone.
 *
 * Returns `undefined` for FOOD record types (`food`, `food-measurement-unit`):
 * they are reference catalogues, not time series, and the filter grammar has
 * no field for them. Callers must not imply a date range was applied.
 */
export function buildTimeFilter({
  dataType,
  startDate,
  endExclusive,
}) {
  const meta = DATA_TYPES[dataType];
  if (!meta) {
    throw new ConfigurationError(`Unknown data type \`${dataType}\`.`);
  }
  const field = TIME_FILTER_FIELD[meta.recordType]?.(meta.filterParam);
  if (!field) {
    return undefined;
  }
  return `${field} >= "${startDate}" AND ${field} < "${endExclusive}"`;
}

/** True when this data type can be narrowed by date at all. */
export function supportsDateFilter(dataType) {
  const meta = DATA_TYPES[dataType];
  return Boolean(meta && TIME_FILTER_FIELD[meta.recordType]?.(meta.filterParam));
}

export function dataSourceFamilyPath(dataSourceFamily) {
  return dataSourceFamily
    ? `${USER}/dataSourceFamilies/${dataSourceFamily}`
    : undefined;
}

/** `"-25200s"` -> `-25200` */
export function durationToSeconds(duration) {
  const match = /^(-?\d+(?:\.\d+)?)s$/.exec(String(duration ?? "").trim());
  return match
    ? Number(match[1])
    : 0;
}

/**
 * Converts an inclusive civil date range into the physical-time instants
 * that bound it in the user's own timezone.
 */
export function utcRangeForDates({
  startDate,
  endExclusive,
  offsetSeconds = 0,
}) {
  const toInstant = (date) => new Date(
    parseDate(date).getTime() - (offsetSeconds * 1000),
  )
    .toISOString();
  return {
    startTime: toInstant(startDate),
    endTime: toInstant(endExclusive),
  };
}

/** Keeps only the named keys of a record. */
export function pluck(obj, names) {
  if (!names?.length) {
    return obj;
  }
  const keep = new Set(names);
  return Object.fromEntries(
    Object.entries(obj ?? {})
      .filter(([
        key,
      ]) => keep.has(key)),
  );
}
