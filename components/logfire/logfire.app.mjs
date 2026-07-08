import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "logfire",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return this.$auth.api_url || "https://logfire-us.pydantic.dev";
    },
    _readToken() {
      return this.$auth.read_token;
    },
    _writeToken() {
      return this.$auth.write_token;
    },
    async _makeRequest({
      $ = this, path, headers, maxRetries = 4, ...otherOpts
    }) {
      for (let attempt = 0; ; attempt += 1) {
        try {
          return await axios($, {
            url: `${this._baseUrl()}${path}`,
            ...otherOpts,
            headers: {
              Authorization: `Bearer ${this._readToken()}`,
              Accept: "application/json",
              ...headers,
            },
          });
        } catch (err) {
          if (err?.response?.status !== 429 || attempt >= maxRetries) {
            throw err;
          }
          // Logfire's query API enforces a per-minute quota and doesn't send
          // a Retry-After header, so back off long enough for that window to
          // clear rather than failing fast.
          const retryAfterSecs = Number(err.response.headers?.["retry-after"]);
          const delayMs = Number.isFinite(retryAfterSecs)
            ? retryAfterSecs * 1000
            : Math.min(5000 * (2 ** attempt), 30000);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    },
    async runQuery({
      $, sql, minTimestamp, maxTimestamp, limit,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/v2/query",
        data: {
          sql,
          min_timestamp: minTimestamp,
          max_timestamp: maxTimestamp,
          limit,
        },
      });
    },
  },
};
