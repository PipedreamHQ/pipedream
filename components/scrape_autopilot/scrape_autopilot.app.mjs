import { axios } from "@pipedream/platform";

const FORMATS = [
  {
    label: "Markdown",
    value: "md",
  },
  {
    label: "HTML",
    value: "html",
  },
  {
    label: "Text",
    value: "text",
  },
];

export default {
  type: "app",
  app: "scrape_autopilot",
  propDefinitions: {
    scrapeAutopilot: {
      type: "app",
      app: "scrape_autopilot",
      label: "Scrape Autopilot",
      description: "Connect your Scrape Autopilot account.",
    },
    format: {
      type: "string",
      label: "Output Format",
      description: "The response format to return.",
      options: FORMATS,
      optional: true,
      default: "md",
    },
    js: {
      type: "boolean",
      label: "Enable JavaScript Rendering",
      description: "Use JavaScript rendering for dynamic pages. This consumes more credits.",
      optional: true,
      default: false,
    },
  },
  methods: {
    /**
     * Returns the Scrape Autopilot API base URL.
     *
     * @returns {string} Base URL for Scrape Autopilot API requests.
     */
    _baseUrl() {
      return "https://www.scrappilot.com";
    },
    /**
     * Builds authorization headers for Scrape Autopilot API requests.
     *
     * @returns {object} Headers containing the connected account API key.
     */
    _authHeaders() {
      return {
        Authorization: this.$auth.api_key,
      };
    },
    /**
     * Makes an authenticated Scrape Autopilot API request.
     *
     * @param {object} opts - Request options.
     * @param {*} opts.$ - Pipedream execution context.
     * @param {string} opts.path - API path beginning with `/`.
     * @param {object} [opts.headers] - Additional request headers.
     * @returns {Promise<object>} Parsed API response body.
     */
    async _makeRequest({
      $,
      path,
      headers,
      ...args
    }) {
      return axios($, {
        ...args,
        baseURL: this._baseUrl(),
        url: path,
        headers: {
          ...this._authHeaders(),
          ...headers,
        },
      });
    },
    /**
     * Scrapes one public URL.
     *
     * @param {object} opts - Scrape request options.
     * @param {*} opts.$ - Pipedream execution context.
     * @param {string} opts.url - Fully qualified public URL to scrape.
     * @param {string} [opts.format] - Output format: `md`, `html`, or `text`.
     * @param {boolean} [opts.js] - Whether to enable JavaScript rendering.
     * @returns {Promise<object>} Scrape result.
     */
    async scrapeUrl({
      $,
      url,
      format,
      js,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/api/scrape",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          url,
          format,
          js,
        },
      });
    },
    /**
     * Scrapes multiple public URLs.
     *
     * @param {object} opts - Batch scrape request options.
     * @param {*} opts.$ - Pipedream execution context.
     * @param {string[]} opts.urls - Fully qualified public URLs to scrape.
     * @param {string} [opts.format] - Output format: `md`, `html`, or `text`.
     * @param {boolean} [opts.js] - Whether to enable JavaScript rendering.
     * @returns {Promise<object>} Batch scrape result.
     */
    async scrapeUrls({
      $,
      urls,
      format,
      js,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/api/scrape",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          urls,
          format,
          js,
        },
      });
    },
    /**
     * Gets the remaining credit balance.
     *
     * @param {object} opts - Balance request options.
     * @param {*} opts.$ - Pipedream execution context.
     * @returns {Promise<object>} Account status and credit balance.
     */
    async getBalance({ $ }) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/api/status",
      });
    },
  },
};
