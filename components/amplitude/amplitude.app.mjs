// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import {
  ANALYTICS_BASE_URL,
  ANALYTICS_EU_BASE_URL,
  LIMIT_MIN,
  LIMIT_MAX,
  COHORT_DOWNLOAD_POLL_INTERVAL_MS,
  COHORT_DOWNLOAD_POLL_BUDGET_MS,
  COHORT_DOWNLOAD_MIN_REQUEST_MS,
} from "./common/constants.mjs";
import { sleep } from "./common/utils.mjs";

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
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The `request_id` returned by **Request Cohort Download**. Example: `req_456`.",
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
    /**
     * Builds the query string by hand rather than passing `propKeys` through
     * axios' `params` — Amplitude expects repeated `propKeys=a&propKeys=b`,
     * not axios' default `propKeys[]=a&propKeys[]=b` array serialization.
     */
    requestCohortDownload({
      $, cohortId, props, propKeys = [],
    }) {
      const query = new URLSearchParams();
      if (props !== undefined) {
        query.append("props", props);
      }
      propKeys.forEach((key) => query.append("propKeys", key));
      const search = query.toString();
      return this._analyticsRequest({
        $,
        path: `/api/5/cohorts/request/${cohortId}${search
          ? `?${search}`
          : ""}`,
      });
    },
    getCohortDownloadStatus({
      $, requestId, timeout,
    }) {
      return this._analyticsRequest({
        $,
        path: `/api/5/cohorts/request-status/${requestId}`,
        timeout,
      });
    },
    /**
     * Fetched as a stream (not buffered into memory) so the caller can
     * parse it incrementally — cohort exports can be very large. Axios
     * transparently decompresses gzip content-encoding at the HTTP adapter
     * level for both buffered and streamed responses, so no explicit
     * decompression is needed here.
     */
    downloadCohortFile({
      $, requestId,
    }) {
      return this._analyticsRequest({
        $,
        path: `/api/5/cohorts/request/${requestId}/file`,
        responseType: "stream",
      });
    },
    /**
     * Polls request-status, sleeping between attempts, until the async job
     * reports JOB COMPLETED or COHORT_DOWNLOAD_POLL_BUDGET_MS of wall-clock
     * time has elapsed — whichever comes first — then returns whatever
     * status was last seen. Bounded by elapsed time (not a fixed attempt
     * count), with the remaining budget passed as each request's own
     * timeout and as a cap on the sleep interval, so neither a slow
     * individual call nor an over-long sleep can push the whole loop past
     * the deadline — keeping it safely under the MCP tool-call timeout
     * (60s) even when a request-status call runs slower than usual. Once
     * the remaining budget drops below COHORT_DOWNLOAD_MIN_REQUEST_MS,
     * another request is skipped rather than issued with a timeout too
     * short for a real round-trip to ever complete (which would otherwise
     * abort with ECONNABORTED right as the budget runs out); a timeout on
     * an attempted request is likewise treated as "still in progress"
     * rather than left to throw. If the job is still running when the
     * budget runs out, the caller (Get Cohort Download Status) just gets an
     * in-progress status back and is expected to call again.
     */
    async pollCohortDownloadStatus({
      $, requestId,
    }) {
      const deadline = Date.now() + COHORT_DOWNLOAD_POLL_BUDGET_MS;
      let status = {
        request_id: requestId,
        async_status: "JOB INPROGRESS",
      };
      do {
        const remaining = deadline - Date.now();
        if (remaining < COHORT_DOWNLOAD_MIN_REQUEST_MS) {
          break;
        }
        try {
          status = await this.getCohortDownloadStatus({
            $,
            requestId,
            timeout: remaining,
          });
        } catch (err) {
          if (err.code === "ECONNABORTED") {
            break;
          }
          throw err;
        }
        const sleepBudget = deadline - Date.now();
        if (status.async_status === "JOB COMPLETED" || sleepBudget <= 0) {
          break;
        }
        await sleep(Math.min(COHORT_DOWNLOAD_POLL_INTERVAL_MS, sleepBudget));
      } while (Date.now() < deadline);
      return status;
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
