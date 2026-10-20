import { axios } from "@pipedream/platform";
import { SITEMAP_URLS_PAGE_SIZE } from "./common/constants.mjs";

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
      description: "How the page is returned: `markdown`, `raw` or `json`, e.g. `markdown`. Markdown is the best input for an AI step.",
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
      description: "Render the page in a browser before capturing it, e.g. `true`. Use when the content comes back empty. Cannot be combined with **Custom Headers**.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "ISO 3166-1 alpha-2 country code, e.g. `US`. The page comes back as it is served in that country.",
      optional: true,
    },
    solveCaptcha: {
      type: "boolean",
      label: "Solve Captcha",
      description: "Attempt to solve a captcha challenge, e.g. `true`. Set to `false` to fail fast instead.",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Custom Headers",
      description: "Request headers to forward (max 50), e.g. `{\"Accept-Language\": \"en-US\"}`. Cannot be combined with **Render JavaScript**.",
      optional: true,
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of a sitemap crawl job, a UUID such as `6f1c9f0a-8f3e-4a5d-...`. Use **Map Site URLs** to start a crawl (the `jobId` field).",
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
    searchWeb(opts = {}) {
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
    /**
     * Page through every URL a finished crawl discovered and return them with
     * the job's `total`
     */
    async getAllSitemapUrls({
      jobId, ...opts
    }) {
      const urls = [];
      let total = 0;
      do {
        const page = await this.getSitemapUrls({
          jobId,
          params: {
            limit: SITEMAP_URLS_PAGE_SIZE,
            offset: urls.length,
          },
          ...opts,
        });
        total = page.total;
        if (!page.urls?.length) {
          break;
        }
        urls.push(...page.urls);
      } while (urls.length < total);
      return {
        jobId,
        total,
        urls,
      };
    },
  },
};
