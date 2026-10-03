import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "string_web_access",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to fetch, e.g. `https://example.com/pricing`",
    },
    format: {
      type: "string",
      label: "Format",
      description: "How the page is returned. Markdown is the best input for an AI step.",
      options: [
        {
          label: "Clean, LLM-ready Markdown",
          value: "markdown",
        },
        {
          label: "The verbatim upstream body",
          value: "raw",
        },
        {
          label: "A JSON envelope with the destination's status and headers",
          value: "json",
        },
      ],
      optional: true,
      default: "markdown",
    },
    executeJS: {
      type: "boolean",
      label: "Render JavaScript",
      description: "Render the page in a browser before capturing it. Use when the content comes back empty. Cannot be combined with **Custom Headers**.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "[ISO 3166-1 alpha-2](https://portal.usestring.ai/docs/fetch/proxies-and-geolocation) country to route the request through, e.g. `US`",
      optional: true,
    },
    solveCaptcha: {
      type: "boolean",
      label: "Solve Captcha",
      description: "Attempt to solve a captcha challenge. Set to `false` to fail fast instead.",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Custom Headers",
      description: "Request headers to forward (max 50). Cannot be combined with **Render JavaScript**.",
      optional: true,
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of a sitemap crawl job (e.g. as returned by the **Map Site URLs** action)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://request.usestring.ai/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    /**
     * Fetch a URL and return the page in the requested format
     *
     * @param {Object} opts - Options passed to the request
     * @param {Object} opts.data - The request body, which must carry `url`
     * @returns {Object|String} The page, as Markdown, the raw body, or a JSON envelope
     */
    fetchUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/fetch",
        ...opts,
      });
    },
    /**
     * Run a web search and return the organic results
     *
     * @param {Object} opts - Options passed to the request
     * @param {Object} opts.data - The request body, which must carry `query`
     * @returns {Object} `results` plus any surfaces the engine rendered around them
     */
    search(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search",
        ...opts,
      });
    },
    /**
     * Submit a sitemap crawl and get a quote back. Nothing is crawled or billed
     * until the job is approved.
     *
     * @param {Object} opts - Options passed to the request
     * @param {Object} opts.data - The request body, which must carry `url`
     * @returns {Object} `jobId`, `status`, `estimatedCostUsd` and `estimatedPages`
     */
    submitSitemap(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sitemap",
        ...opts,
      });
    },
    /**
     * Approve a quoted crawl. This is the billing-consent step.
     *
     * @param {Object} opts - Options passed to the request
     * @param {String} opts.jobId - The job to approve
     * @returns {Object} The job's status
     */
    approveSitemap({
      jobId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sitemap/${jobId}/approve`,
        ...opts,
      });
    },
    /**
     * Get a crawl job's status and progress
     *
     * @param {Object} opts - Options passed to the request
     * @param {String} opts.jobId - The job to poll
     * @returns {Object} The job's `status`, plus progress or error fields
     */
    getSitemapStatus({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/sitemap/${jobId}`,
        ...opts,
      });
    },
    /**
     * Page through the URLs a crawl discovered
     *
     * @param {Object} opts - Options passed to the request
     * @param {String} opts.jobId - The finished job
     * @param {Object} [opts.params] - `limit` (max 5000) and `offset`
     * @returns {Object} `total` and `urls`
     */
    getSitemapUrls({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/sitemap/${jobId}/urls`,
        ...opts,
      });
    },
  },
};
