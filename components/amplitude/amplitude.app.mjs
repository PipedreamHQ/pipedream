// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import {
  ANALYTICS_BASE_URL,
  ANALYTICS_EU_BASE_URL,
  LIMIT_MIN,
  LIMIT_MAX,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "amplitude",
  propDefinitions: {
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date, inclusive, in `YYYYMMDD` format (the `start` param). Example: `20240706`.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date, inclusive, in `YYYYMMDD` format (the `end` param). Example: `20240805`.",
    },
    segmentDefinitions: {
      type: "string",
      label: "Segment Definitions",
      description: "JSON-encoded array of segment definitions (the `s` param). Example: `[{\"prop\":\"country\",\"op\":\"is\",\"values\":[\"US\"]}]`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of grouped values to return (the \`limit\` param). Min ${LIMIT_MIN}, max ${LIMIT_MAX}. Defaults to 100. Amplitude has no cursor for this endpoint — values beyond this cap are silently dropped by the API, not just this tool. If more than \`limit\` distinct group-by values may exist, raise this toward ${LIMIT_MAX} or narrow with Segment Definitions/Group By.`,
      min: LIMIT_MIN,
      max: LIMIT_MAX,
      optional: true,
    },
  },
  methods: {
    _baseURL(type) {
      if (type === "httpV2") {
        if (this.$auth.region.startsWith("https://analytics.eu")) {
          return "https://api.eu.amplitude.com/2";
        }
        return "https://api2.amplitude.com/2";
      }
      return `https://${this.$auth.region}`;
    },
    _analyticsBaseUrl() {
      if (this.$auth.region && this.$auth.region.startsWith("https://analytics.eu")) {
        return ANALYTICS_EU_BASE_URL;
      }
      return ANALYTICS_BASE_URL;
    },
    async _makeRequest({
      $ = this, path, data, ...opts
    }) {
      const config = {
        url: opts.url || `${this._baseURL()}/${path}`,
        data,
        ...opts,
      };
      return axios($, config);
    },
    _analyticsRequest({
      $, path, ...opts
    }) {
      return axios($, {
        url: `${this._analyticsBaseUrl()}${path}`,
        auth: {
          username: this.$auth.api_key,
          password: this.$auth.api_secret,
        },
        ...opts,
      });
    },
    sendEventData({
      $,
      data,
    }) {
      data.api_key = this.$auth.api_key;
      return this._makeRequest({
        $,
        method: "POST",
        url: `${this._baseURL("httpV2")}/httpapi`,
        data,
      });
    },
    getEventSegmentation({
      $, params,
    }) {
      return this._analyticsRequest({
        $,
        path: "/api/2/events/segmentation",
        params,
      });
    },
    getFunnelAnalysis({
      $, params,
    }) {
      return this._analyticsRequest({
        $,
        path: "/api/2/funnels",
        params,
      });
    },
    getRetentionAnalysis({
      $, params,
    }) {
      return this._analyticsRequest({
        $,
        path: "/api/2/retention",
        params,
      });
    },
    searchUsers({
      $, params,
    }) {
      return this._analyticsRequest({
        $,
        path: "/api/2/usersearch",
        params,
      });
    },
    /**
     * Amplitude's User Activity endpoint has no cursor, only `offset`/`limit`
     * (per-request cap 1000), and may return slightly more events than
     * requested to avoid splitting a session. This walks `offset` forward in
     * `LIMIT_MAX`-sized pages until `params.limit` events are collected or a
     * page returns fewer than requested (the stream is exhausted), so a
     * caller asking for more than 1000 events no longer silently gets page 1.
     */
    async getUserActivity({
      $, params = {},
    }) {
      const desired = params.limit ?? LIMIT_MAX;
      const events = [];
      let offset = params.offset ?? 0;
      let first;
      let truncated = false;
      while (events.length < desired) {
        const requested = Math.min(LIMIT_MAX, desired - events.length);
        const page = await this._analyticsRequest({
          $,
          path: "/api/2/useractivity",
          params: {
            ...params,
            offset,
            limit: requested,
          },
        });
        first ??= page;
        const batch = page?.events ?? [];
        events.push(...batch);
        offset += batch.length;
        if (batch.length < requested) {
          break;
        }
        if (events.length >= desired) {
          truncated = true;
        }
      }
      return {
        ...first,
        events: events.slice(0, desired),
        truncated,
      };
    },
    listCohorts({
      $, params,
    }) {
      return this._analyticsRequest({
        $,
        path: "/api/3/cohorts",
        params,
      });
    },
    getCohort({
      $, cohortId,
    }) {
      return this._analyticsRequest({
        $,
        path: `/api/3/cohorts/${cohortId}`,
      });
    },
    createCohort({
      $, data,
    }) {
      return this._analyticsRequest({
        $,
        method: "POST",
        path: "/api/3/cohorts/upload",
        data,
      });
    },
  },
};
