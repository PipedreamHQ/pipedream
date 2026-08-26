import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  DATA_SOURCE_FAMILIES,
  DATA_TYPES,
  USER,
} from "./common/constants.mjs";
import {
  addDays,
  buildTimeFilter,
  civilInterval,
  dataSourceFamilyPath,
  durationToSeconds,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "google_health",
  propDefinitions: {
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date in `YYYY-MM-DD` format (e.g. `2026-08-24`), interpreted in the user's own timezone. Defaults to **today's date in UTC**, which can be a day ahead or behind the user's local date late at night or early in the morning — pass an explicit date whenever the exact day matters. Every response echoes the dates it actually used.",
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
     *
     * `pageSize` is pinned to the API maximum because `DailyRollUpDataPointsResponse`
     * carries no `nextPageToken`: if the server ever returned a partial set
     * there would be no way to detect it. One window per day against a 90-day
     * ceiling means the real ask never approaches the cap.
     */
    async dailyRollUp({
      $,
      dataType,
      startDate,
      endExclusive,
      dataSourceFamily,
      windowSizeDays = 1,
    } = {}) {
      const familyPath = dataSourceFamilyPath(dataSourceFamily);
      const response = await this.dailyRollUpDataPoints({
        $,
        dataType,
        data: {
          range: civilInterval(startDate, endExclusive),
          windowSizeDays,
          pageSize: 10000,
          ...familyPath
            ? {
              dataSourceFamily: familyPath,
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
    async resolveUtcOffset({
      $,
      dataType,
      startDate,
      endExclusive,
    } = {}) {
      const probe = async (from, to) => {
        const response = await this.listDataPoints({
          $,
          dataType,
          filter: buildTimeFilter({
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
          offsetSeconds: durationToSeconds(inRange),
          offsetSource: "in-range",
        };
      }

      // Nothing in the requested window. Offsets rarely change, so the most
      // recent nearby sample is a good stand-in. `list` has no range cap, so
      // widening the probe here is free.
      const nearby = await probe(addDays(startDate, -30), endExclusive);
      if (nearby !== undefined) {
        return {
          utcOffset: nearby,
          offsetSeconds: durationToSeconds(nearby),
          offsetSource: "nearby",
        };
      }

      return {
        utcOffset: "0s",
        offsetSeconds: 0,
        offsetSource: "utc-assumed",
      };
    },
  },
};
