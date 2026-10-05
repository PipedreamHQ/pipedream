import { axios, ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "lambdatest",
  propDefinitions: {
    buildId: {
      type: "string",
      label: "Build ID",
      description: "The ID of the automation build, e.g. `1`. Use the **List Builds** action to retrieve build IDs.",
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The ID of the automation test session, e.g. `Z17EF-OPUKH-BDAE8-YEPXU`. Use the **List Sessions** action to retrieve session IDs.",
    },
    buildStatus: {
      type: "string[]",
      label: "Status",
      description: "Return only builds in these statuses, e.g. `running`. Leave empty to return every status.",
      options: [
        "running",
        "queued",
        "completed",
        "timeout",
        "error",
      ],
      optional: true,
    },
    sessionStatus: {
      type: "string[]",
      label: "Status",
      description: "Return only sessions in these statuses, e.g. `passed`. Leave empty to return every status.",
      options: [
        "running",
        "queued",
        "completed",
        "passed",
        "failed",
        "timeout",
        "error",
        "lambda-error",
      ],
      optional: true,
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Return records created on or after this date, in `YYYY-MM-DD` format, e.g. `2026-01-31`.",
      optional: true,
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "Return records created on or before this date, in `YYYY-MM-DD` format, e.g. `2026-02-28`.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return, e.g. `100`. Must be `1` or greater.",
      default: 100,
      min: 1,
      optional: true,
    },
  },
  methods: {
    /**
     * Returns the base URL of the LambdaTest automation API
     * @returns {string} The base URL
     */
    _baseUrl() {
      return "https://api.lambdatest.com/automation/api/v1";
    },
    /**
     * Builds the HTTP basic auth credentials from the connected account
     * @returns {object} An object with the `username` and `password` used for basic auth
     */
    _auth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.access_key}`,
      };
    },
    /**
     * Makes an authenticated request against the LambdaTest automation API
     * @param {object} opts - The request options
     * @param {object} [opts.$] - The Pipedream component instance, used for logging
     * @param {string} opts.path - The API path, appended to the base URL
     * @returns {Promise<object>} The parsed API response
     */
    _makeRequest({
      $ = this, path, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...opts,
      });
    },
    /**
     * Fetches all builds of an account
     * @param {object} [opts] - The request options, including `params` for query parameters
     * @returns {Promise<object>} An object with a `Meta` property and a `data` array of builds
     */
    listBuilds(opts = {}) {
      return this._makeRequest({
        path: "/builds",
        ...opts,
      });
    },
    /**
     * Fetches a single build
     * @param {object} opts - The request options
     * @param {string} opts.buildId - The ID of the build to retrieve
     * @returns {Promise<object>} The build details
     */
    getBuild({
      buildId, ...opts
    }) {
      return this._makeRequest({
        path: `/builds/${buildId}`,
        ...opts,
      });
    },
    /**
     * Fetches all test sessions of an account
     * @param {object} [opts] - The request options, including `params` for query parameters
     * @returns {Promise<object>} An object with a `Meta` property and a `data` array of sessions
     */
    listSessions(opts = {}) {
      return this._makeRequest({
        path: "/sessions",
        ...opts,
      });
    },
    /**
     * Fetches a single test session
     * @param {object} opts - The request options
     * @param {string} opts.sessionId - The ID of the session to retrieve
     * @returns {Promise<object>} The session details
     */
    getSession({
      sessionId, ...opts
    }) {
      return this._makeRequest({
        path: `/sessions/${sessionId}`,
        ...opts,
      });
    },
    /**
     * Iterates through a paginated LambdaTest list endpoint, yielding one record at a time
     * @param {object} opts - The pagination options
     * @param {object} [opts.$] - The Pipedream component instance, used for logging
     * @param {Function} opts.fn - The method to call for each page, such as `listBuilds`
     * @param {object} [opts.params] - Query parameters applied to every page
     * @param {number} opts.maxResults - Stops once this many records have been yielded
     * @yields {object} A single record from the `data` array of the response
     * @throws {ConfigurationError} If `maxResults` is set to less than 1
     */
    async *paginate({
      $, fn, params = {}, maxResults,
    }) {
      if (maxResults !== undefined && maxResults < 1) {
        throw new ConfigurationError("**Max Results** must be `1` or greater.");
      }

      const limit = 100;
      let offset = 0;
      let count = 0;

      while (true) {
        const response = await fn.call(this, {
          $,
          params: {
            ...params,
            limit,
            offset,
          },
        });

        const data = response?.data ?? [];
        for (const item of data) {
          yield item;
          if (maxResults !== undefined && ++count >= maxResults) {
            return;
          }
        }

        offset += limit;
        const total = response?.Meta?.result_set?.total;
        const hasMore = total !== undefined
          ? offset < total
          : data.length === limit;

        if (!hasMore) {
          return;
        }
      }
    },
  },
};
