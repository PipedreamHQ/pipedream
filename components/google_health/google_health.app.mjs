import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  DATA_SOURCE_FAMILIES,
  DATA_TYPES,
  DEFAULT_MAX_RANGE_DAYS,
  TIME_FILTER_FIELD,
  USER,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "google_health",
  propDefinitions: {
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date in `YYYY-MM-DD` format (e.g. `2026-08-24`). Defaults to today. Dates are interpreted in the user's own timezone, not UTC.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date in `YYYY-MM-DD` format, **inclusive**. Defaults to Start Date, i.e. a single day. For a whole week, set Start Date to the Monday and End Date to the Sunday.",
      optional: true,
    },
    dataSourceFamily: {
      type: "string",
      label: "Data Source",
      description: "Which data sources to include. `all-sources` (the default) counts everything. `google-wearables` counts only Fitbit trackers and Pixel Watches, **excluding manually logged entries** — use it when the user asks about what their watch or tracker recorded. Only applies to aggregated (roll-up) queries.",
      options: DATA_SOURCE_FAMILIES,
      default: "all-sources",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Field names to return for each record. Omit for a compact default set. Pass only the fields you need — smaller responses keep the conversation fast.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return BASE_URL;
    },
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      return axios($ ?? this, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...otherConfig,
      });
    },

    /**
     * Google encodes int64 as a JSON *string*. Every step count, distance,
     * height and sleep-minutes field arrives as text, so an unguarded sum
     * produces string concatenation: "8432" + "7911" === "84327911".
     */
    _int(value) {
      if (value === null || value === undefined || value === "") {
        return null;
      }
      const n = Number(value);
      return Number.isFinite(n)
        ? n
        : null;
    },
    _sumInts(values = []) {
      const nums = values
        .map((v) => this._int(v))
        .filter((v) => v !== null);
      return nums.length
        ? nums.reduce((a, b) => a + b, 0)
        : null;
    },
    _round(value, places = 2) {
      if (value === null || value === undefined) {
        return null;
      }
      const factor = 10 ** places;
      return Math.round(value * factor) / factor;
    },

    _dateOrToday(date) {
      return date || new Date()
        .toISOString()
        .slice(0, 10);
    },
    /**
     * Parses `YYYY-MM-DD` as a UTC calendar date. Parsing it as local time
     * would shift the day for anyone west of UTC and silently return the
     * wrong date's data.
     */
    _parseDate(date) {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date).trim());
      if (!match) {
        throw new Error(`Invalid date \`${date}\`. Use \`YYYY-MM-DD\`, e.g. \`2026-08-24\`.`);
      }
      const [
        ,
        year,
        month,
        day,
      ] = match.map(Number);
      const ms = Date.UTC(year, month - 1, day);
      const parsed = new Date(ms);
      if (parsed.getUTCFullYear() !== year
        || parsed.getUTCMonth() !== month - 1
        || parsed.getUTCDate() !== day) {
        throw new Error(`\`${date}\` is not a real calendar date.`);
      }
      return parsed;
    },
    _formatDate(dateObj) {
      return dateObj.toISOString()
        .slice(0, 10);
    },
    _addDays(date, days) {
      const parsed = this._parseDate(date);
      return this._formatDate(new Date(parsed.getTime() + (days * 86400000)));
    },
    _daysBetween(startDate, endDate) {
      const ms = this._parseDate(endDate).getTime() - this._parseDate(startDate).getTime();
      return Math.round(ms / 86400000);
    },
    /**
     * Resolves the inclusive date range an action was called with into the
     * closed-open `[start, endExclusive)` the API expects, validating the
     * per-data-type range cap on the way through.
     *
     * Caps are 14 days for `heart-rate`, `active-minutes`, `total-calories` and
     * `calories-in-heart-rate-zone`; 90 for everything else.
     */
    _resolveRange({
      startDate,
      endDate,
      dataTypes = [],
    }) {
      const start = this._dateOrToday(startDate);
      const end = endDate || start;
      const span = this._daysBetween(start, end);
      if (span < 0) {
        throw new Error(`End Date \`${end}\` is before Start Date \`${start}\`.`);
      }
      const days = span + 1;

      const capped = dataTypes
        .map((dataType) => ({
          dataType,
          max: DATA_TYPES[dataType]?.maxRangeDays ?? DEFAULT_MAX_RANGE_DAYS,
        }))
        .sort((a, b) => a.max - b.max)[0];
      if (capped && days > capped.max) {
        throw new Error(
          `Requested ${days} days (${start} to ${end}) but the Google Health API caps `
          + `\`${capped.dataType}\` queries at ${capped.max} days. Narrow the date range and call again.`,
        );
      }

      return {
        startDate: start,
        endDate: end,
        endExclusive: this._addDays(end, 1),
        days,
      };
    },

    /** `2026-08-24` -> `{ date: { year: 2026, month: 8, day: 24 } }` */
    _civilDateTime(date) {
      const parsed = this._parseDate(date);
      return {
        date: {
          year: parsed.getUTCFullYear(),
          month: parsed.getUTCMonth() + 1,
          day: parsed.getUTCDate(),
        },
      };
    },
    /**
     * `{ date: { year: 2026, month: 8, day: 24 } }` -> `2026-08-24`.
     *
     * Roll-up results carry `civilStartTime`/`civilEndTime`, not a `date`
     * field — the flat string is what every caller actually wants to key on.
     */
    _civilDateToString(civil) {
      const date = civil?.date;
      if (!date?.year || !date?.month || !date?.day) {
        return null;
      }
      const pad = (n) => String(n)
        .padStart(2, "0");
      return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
    },
    _civilInterval(startDate, endExclusive) {
      return {
        start: this._civilDateTime(startDate),
        end: this._civilDateTime(endExclusive),
      };
    },
    /**
     * Builds the AIP-160 time filter for a `list` call. The field name depends
     * on the data type's record type, and civil-time variants are used
     * throughout so no caller needs to know the user's timezone.
     */
    _buildTimeFilter({
      dataType,
      startDate,
      endExclusive,
    }) {
      const meta = DATA_TYPES[dataType];
      if (!meta) {
        throw new Error(`Unknown data type \`${dataType}\`.`);
      }
      const field = TIME_FILTER_FIELD[meta.recordType]?.(meta.filterParam);
      if (!field) {
        return undefined;
      }
      return `${field} >= "${startDate}" AND ${field} < "${endExclusive}"`;
    },

    _dataSourceFamilyPath(dataSourceFamily) {
      return dataSourceFamily
        ? `${USER}/dataSourceFamilies/${dataSourceFamily}`
        : undefined;
    },

    async getIdentity({ $ } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/${USER}/identity`,
      });
    },
    async listDataPoints({
      $,
      dataType,
      filter,
      pageSize,
      pageToken,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/${USER}/dataTypes/${dataType}/dataPoints`,
        params: {
          ...filter
            ? {
              filter,
            }
            : {},
          ...pageSize
            ? {
              pageSize,
            }
            : {},
          ...pageToken
            ? {
              pageToken,
            }
            : {},
        },
      });
    },
    /**
     * Follows `nextPageToken` up to `maxPages`, then stops and reports it.
     * Returning page one with no signal reads as a complete result set when it
     * isn't — the cap has to be visible to the caller.
     */
    async listAllDataPoints({
      $,
      dataType,
      filter,
      pageSize,
      maxPages = 5,
    } = {}) {
      const dataPoints = [];
      let pageToken;
      let pages = 0;

      do {
        const response = await this.listDataPoints({
          $,
          dataType,
          filter,
          pageSize,
          pageToken,
        });
        dataPoints.push(...response?.dataPoints ?? []);
        pageToken = response?.nextPageToken;
        pages += 1;
      } while (pageToken && pages < maxPages);

      return {
        dataPoints,
        nextPageToken: pageToken,
        pagesFetched: pages,
        truncated: Boolean(pageToken),
      };
    },
    async rollUpDataPoints({
      $,
      dataType,
      data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/${USER}/dataTypes/${dataType}/dataPoints:rollUp`,
        data,
      });
    },
    /**
     * Follows `rollUp`'s cursor up to `maxPages`. Unlike `dailyRollUp`, this
     * response DOES carry a `nextPageToken`, and the default page size is 1440
     * — so a fine window over a multi-day range overflows one page and would
     * otherwise be silently cut off.
     */
    async rollUpAllDataPoints({
      $,
      dataType,
      data,
      maxPages = 3,
    } = {}) {
      const rollupDataPoints = [];
      let pageToken;
      let pages = 0;

      do {
        const response = await this.rollUpDataPoints({
          $,
          dataType,
          data: {
            ...data,
            ...pageToken
              ? {
                pageToken,
              }
              : {},
          },
        });
        rollupDataPoints.push(...response?.rollupDataPoints ?? []);
        pageToken = response?.nextPageToken;
        pages += 1;
      } while (pageToken && pages < maxPages);

      return {
        rollupDataPoints,
        nextPageToken: pageToken,
        pagesFetched: pages,
        truncated: Boolean(pageToken),
      };
    },
    async dailyRollUpDataPoints({
      $,
      dataType,
      data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/${USER}/dataTypes/${dataType}/dataPoints:dailyRollUp`,
        data,
      });
    },
    /**
     * Rolls one data type up into civil-day buckets. Civil time means the day
     * boundaries are the user's own local midnights, so no timezone lookup is
     * needed anywhere in this path.
     */
    async dailyRollUp({
      $,
      dataType,
      startDate,
      endExclusive,
      dataSourceFamily,
      windowSizeDays = 1,
    } = {}) {
      const response = await this.dailyRollUpDataPoints({
        $,
        dataType,
        data: {
          range: this._civilInterval(startDate, endExclusive),
          windowSizeDays,
          ...this._dataSourceFamilyPath(dataSourceFamily)
            ? {
              dataSourceFamily: this._dataSourceFamilyPath(dataSourceFamily),
            }
            : {},
        },
      });
      return response?.rollupDataPoints ?? [];
    },

    /**
     * Reads the user's UTC offset off their own data.
     *
     * `rollUp` accepts only physical-time instants, so a civil date has to be
     * converted — and assuming UTC midnight is silently wrong for anyone not on
     * UTC (a seven-hour window shift for a US Pacific user, which still returns
     * data and is simply the wrong data).
     *
     * `utcOffset` is a required field on every sample, so one page-size-1 read
     * answers it under a scope this app already holds. It is also more accurate
     * than the account's timezone setting would be: this is the offset that
     * applied when the observation happened, so it is correct across a DST
     * boundary where the current setting is not.
     */
    async _resolveUtcOffset({
      $,
      dataType,
      startDate,
      endExclusive,
    } = {}) {
      const probe = async (from, to) => {
        const response = await this.listDataPoints({
          $,
          dataType,
          filter: this._buildTimeFilter({
            dataType,
            startDate: from,
            endExclusive: to,
          }),
          pageSize: 1,
        });
        const payload = response?.dataPoints?.[0]?.[DATA_TYPES[dataType].unionKey];
        return payload?.sampleTime?.utcOffset
          ?? payload?.interval?.startUtcOffset;
      };

      const inRange = await probe(startDate, endExclusive);
      if (inRange !== undefined) {
        return {
          utcOffset: inRange,
          offsetSeconds: this._durationToSeconds(inRange),
          offsetSource: "in-range",
        };
      }

      // Nothing in the requested window. Offsets rarely change, so the most
      // recent nearby sample is a good stand-in.
      const nearby = await probe(this._addDays(startDate, -30), endExclusive);
      if (nearby !== undefined) {
        return {
          utcOffset: nearby,
          offsetSeconds: this._durationToSeconds(nearby),
          offsetSource: "nearby",
        };
      }

      return {
        utcOffset: "0s",
        offsetSeconds: 0,
        offsetSource: "utc-assumed",
      };
    },
    /** `"-25200s"` -> `-25200` */
    _durationToSeconds(duration) {
      const match = /^(-?\d+(?:\.\d+)?)s$/.exec(String(duration ?? "").trim());
      return match
        ? Number(match[1])
        : 0;
    },
    /**
     * Converts an inclusive civil date range into the physical-time instants
     * that bound it in the user's own timezone.
     */
    _utcRangeForDates({
      startDate,
      endExclusive,
      offsetSeconds = 0,
    }) {
      const toInstant = (date) => new Date(
        this._parseDate(date)
          .getTime() - (offsetSeconds * 1000),
      )
        .toISOString();
      return {
        startTime: toInstant(startDate),
        endTime: toInstant(endExclusive),
      };
    },

    /** Keeps a curated subset of each record's keys, always retaining ids. */
    pluck(obj, names) {
      if (!names?.length) {
        return obj;
      }
      const keep = new Set([
        "id",
        "name",
        ...names,
      ]);
      return Object.fromEntries(
        Object.entries(obj ?? {})
          .filter(([
            key,
          ]) => keep.has(key)),
      );
    },
  },
};
