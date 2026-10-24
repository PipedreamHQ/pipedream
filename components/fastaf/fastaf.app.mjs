import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fastaf",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "Public HTTP(S) page URL. Private targets and login paths are refused. [Documentation](https://fastaf.co/docs/#scrape)",
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "Search text, such as `espresso machines`. [Documentation](https://fastaf.co/docs/#endpoints)",
    },
    country: {
      type: "string",
      label: "Search Country",
      description: "Two-letter search country code, such as `us` or `fr`. Omit to use the endpoint default, usually `us`. Does not add credits on search endpoints. [Documentation](https://fastaf.co/docs/#endpoint-reference)",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Result language code, such as `en` or `fr`. Omit for the endpoint default, usually `en`. Jobs uses a locale such as `en_us`. [Documentation](https://fastaf.co/docs/#endpoint-reference)",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Zero-based search page: `0` is the first page. One page per execution; each execution consumes credits. [Documentation](https://fastaf.co/docs/#serp)",
      optional: true,
    },
    results: {
      type: "integer",
      label: "Maximum Results",
      description: "Limit the returned page to 1-100 results. Google normally supplies up to 10; a larger limit does not fetch more pages. Omit for the full available page. [Documentation](https://fastaf.co/docs/#serp)",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Google Domain",
      description: "Google hostname, such as `google.com` or `google.co.uk`; omitted: `google.com`. [Documentation](https://fastaf.co/docs/#serp)",
      optional: true,
    },
    dynamic: {
      type: "boolean",
      label: "Render JavaScript",
      description: "Enable browser rendering. Leave unset for FastAF defaults: false normally, true on Booking with an 8000 ms wait. Base cost is 1 credit for static, 5 rendered, 10 with premium/country, or 25 rendered with premium/country. [Documentation](https://fastaf.co/docs/#scrape)",
      optional: true,
    },
    premium: {
      type: "boolean",
      label: "Premium Proxies",
      description: "Use residential proxies; default false. Scrape costs 10 base credits, or 25 with rendering. Cannot combine with **Challenge Mode**. [Documentation](https://fastaf.co/docs/#scrape)",
      optional: true,
    },
    proxyCountry: {
      type: "string",
      label: "Proxy Country",
      description: "Two-letter proxy country code, such as `us` or `gb`. Leave unset for no targeting. Any country selects premium pricing (10 base credits, or 25 with rendering), even if **Premium Proxies** is false. [Documentation](https://fastaf.co/docs/#scrape)",
      optional: true,
    },
    wait: {
      type: "integer",
      label: "Browser Wait (ms)",
      description: "Extra browser delay in milliseconds, 0-35000. Does not enable rendering or add credits. Omit to preserve FastAF site defaults. [Documentation](https://fastaf.co/docs/#scrape)",
      optional: true,
    },
    challengeMode: {
      type: "boolean",
      label: "Challenge Mode",
      description: "Handle browser-verification pages using a dedicated mode, 10 base credits. Cannot combine true with rendering, premium proxies or proxy country. Default false. [Documentation](https://fastaf.co/docs/#scrape)",
      optional: true,
    },
    aiQuery: {
      type: "string",
      label: "Extraction Prompt",
      description: "Natural-language extraction instructions, such as `Return the page title and its purpose`. Required unless **Extraction Rules** is supplied. AI adds 10 credits once per request, even when both are used. [Documentation](https://fastaf.co/docs/#scrape)",
      optional: true,
    },
    aiExtractRules: {
      type: "object",
      label: "Extraction Rules",
      description: "Fields and extraction instructions, for example `{\"title\":\"page title\",\"price\":\"product price\"}`. The action JSON-encodes this object into the scalar `ai_extract_rules` API field. Required unless **Extraction Prompt** is supplied. [Documentation](https://fastaf.co/docs/#scrape)",
      optional: true,
    },
  },
  methods: {
    /**
     * Send one authenticated, non-retried FastAF request. Never return Axios
     * config/request objects from an action: they contain Authorization.
     * @param {object} opts - Context, fixed endpoint path, data and response type.
     * @returns {Promise<object>} Full response for internal data/header handling.
     */
    async _makeRequest({
      $ = this, path, data = {}, responseType,
    }) {
      const payload = Object.fromEntries(Object.entries(data).filter(([
        , value,
      ]) =>
        value !== undefined && value !== null && value !== ""));
      // Older platform releases export Axios config on HTTP failures. Only
      // forward the numeric status, never Authorization, request data or bodies.
      const safeContext = {
        export(name, value) {
          if (name === "debug" && Number.isInteger(value?.status)) {
            $.export?.("fastafError", {
              status: value.status,
            });
          }
        },
      };
      try {
        return await axios(safeContext, {
          method: "POST",
          url: `https://api.fastaf.co/v1/${path}`,
          headers: {
            "Authorization": `Bearer ${this.$auth.api_key}`,
            "Content-Type": "application/json",
          },
          data: payload,
          responseType,
          timeout: 120000,
          maxRedirects: 0,
          returnFullResponse: true,
        });
      } catch (error) {
        // Do not expose request config, response payloads, targets or credentials.
        const status = error.response?.status || error.status;
        const messages = {
          400: "Check the action inputs and supported parameter combinations.",
          401: "Reconnect the FastAF account with a valid API key.",
          402: "Add FastAF credits or check the account's free-request eligibility.",
          403: "Check that the FastAF account is active and verified.",
          429: "Rate or concurrency limit reached; wait before another execution.",
          502: "The source returned unavailable, blocked or empty data; try later.",
          503: "Service capacity is temporarily unavailable; try later.",
          504: "The source request timed out; try later.",
        };
        const safeError = new Error(`FastAF request failed${status
          ? ` (HTTP ${status})`
          : ""}. ${messages[status] || "Check service availability and inputs before retrying."}`);
        if (status) safeError.status = status;
        throw safeError;
      }
    },
    /**
     * Fetch HTML, markdown or AI-extracted page data.
     * @param {object} opts - Context and documented scrape parameters.
     * @returns {Promise<object>} FastAF response.
     */
    scrape(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "scrape",
      });
    },
    /**
     * Retrieve a single Google search results page.
     * @param {object} opts - Context and search parameters.
     * @returns {Promise<object>} FastAF response.
     */
    search(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "serp",
      });
    },
    /**
     * Capture a page as binary image data.
     * @param {object} opts - Context and screenshot parameters.
     * @returns {Promise<object>} FastAF response with an ArrayBuffer body.
     */
    screenshot(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "screenshot",
        responseType: "arraybuffer",
      });
    },
    /**
     * Retrieve an Amazon resource.
     * @param {object} opts - Context and resource-specific parameters.
     * @returns {Promise<object>} FastAF response.
     */
    amazon(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "amazon",
      });
    },
    /**
     * Search Maps or retrieve one place.
     * @param {object} opts - Context and Maps parameters.
     * @returns {Promise<object>} FastAF response.
     */
    maps(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "maps",
      });
    },
    /**
     * Retrieve a public LinkedIn person profile.
     * @param {object} opts - Context and profile identifier.
     * @returns {Promise<object>} FastAF response.
     */
    linkedin(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "linkedin",
      });
    },
    /**
     * Retrieve a YouTube transcript or search results.
     * @param {object} opts - Context and resource-specific parameters.
     * @returns {Promise<object>} FastAF response.
     */
    youtube(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "youtube",
      });
    },
    /**
     * Retrieve one page of news results.
     * @param {object} opts - Context and news search parameters.
     * @returns {Promise<object>} FastAF response.
     */
    news(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "news",
      });
    },
    /**
     * Retrieve one page of job results.
     * @param {object} opts - Context and job search parameters.
     * @returns {Promise<object>} FastAF response.
     */
    jobs(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "jobs",
      });
    },
  },
};
