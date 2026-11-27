import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  MAX_RETRIES,
  MAX_RETRY_WAIT_SECONDS,
  STATUS_OPTIONS,
} from "./common/constants.mjs";
import { sleep } from "./common/utils.mjs";

export default {
  type: "app",
  app: "flatverify",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address to check, e.g. `maya.chen@amazon.com`.",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The addresses to check as one list, up to 200,000, e.g. `[\"maya.chen@amazon.com\", \"j.ortiz@salesforce.com\"]`. Entries that contain commas or line breaks are split too. Duplicates and entries that are not an address are skipped.",
    },
    listName: {
      type: "string",
      label: "List Name",
      description: "A name for the list shown in Flatverify, e.g. `Webinar signups`.",
      optional: true,
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of a verification job, e.g. `6f1c2b8e-3d4a-4f5b-9c7d-1e2f3a4b5c6d`. Use **Verify List** to start a job and read the `id` field.",
    },
    statuses: {
      type: "string[]",
      label: "Only Return These Statuses",
      description: "Return only rows with these statuses, e.g. `[\"valid\"]`. One or more of `valid`, `invalid`, `risky`, `unknown`. Leave empty to return every row.",
      options: STATUS_OPTIONS,
      optional: true,
    },
  },
  methods: {
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/json",
        "User-Agent": "flatverify-pipedream/0.1.0",
        ...headers,
      };
    },
    _retryWaitMs(error) {
      const value = Number(error?.response?.headers?.["retry-after"]);
      const seconds = Number.isFinite(value) && value > 0
        ? value
        : 2;
      return Math.min(seconds, MAX_RETRY_WAIT_SECONDS) * 1000;
    },
    _isRetryable(error) {
      const status = error?.response?.status;
      const code = error?.response?.data?.error?.code;
      return status === 503 || (status === 429 && code !== "too_many_jobs");
    },
    async _makeRequest({
      $ = this, headers, ...args
    }) {
      for (let attempt = 0; ; attempt++) {
        try {
          return await axios($, {
            baseURL: BASE_URL,
            headers: this._headers(headers),
            ...args,
          });
        } catch (error) {
          if (!this._isRetryable(error) || attempt >= MAX_RETRIES) {
            throw error;
          }
          await sleep(this._retryWaitMs(error));
        }
      }
    },
    verifyEmail(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/verify",
        ...args,
      });
    },
    startBulkJob(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/verify/bulk",
        ...args,
      });
    },
    getJob({
      jobId, ...args
    }) {
      return this._makeRequest({
        url: `/jobs/${encodeURIComponent(jobId)}`,
        ...args,
      });
    },
    getJobResults({
      jobId, params, ...args
    }) {
      return this._makeRequest({
        url: `/jobs/${encodeURIComponent(jobId)}/results`,
        params: {
          format: "json",
          ...params,
        },
        ...args,
      });
    },
    getAccount(args = {}) {
      return this._makeRequest({
        url: "/account",
        ...args,
      });
    },
    async collectResults({
      $, jobId, after, maxPages, statuses = [],
    }) {
      const rows = [];
      let cursor = after;
      let pages = 0;
      let nextAfter = null;
      do {
        const page = await this.getJobResults({
          $,
          jobId,
          params: {
            after: cursor,
          },
        });
        rows.push(...(page?.results ?? []));
        pages += 1;
        nextAfter = typeof page?.next_after === "number"
          ? page.next_after
          : null;
        cursor = nextAfter ?? undefined;
      } while (nextAfter !== null && pages < maxPages);
      const filtered = statuses.length
        ? rows.filter((row) => statuses.includes(row.status))
        : rows;
      return {
        results: filtered,
        count: filtered.length,
        rowsRead: rows.length,
        nextAfter,
        hasMore: nextAfter !== null,
      };
    },
  },
};
