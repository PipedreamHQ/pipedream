import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scrapegraphai",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL to Scrape",
      description: "The URL of the website to scrape.",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "A prompt describing what you want to extract. Example: `Extract info about the company`",
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait For Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the request is completed",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.scrapegraphai.com/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "sgai-apikey": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    startSmartScraper(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/smartscraper",
        ...opts,
      });
    },
    getSmartScraperStatus({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/smartscraper/${requestId}`,
        ...opts,
      });
    },
    startLocalScraper(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/localscraper",
        ...opts,
      });
    },
    getLocalScraperStatus({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/localscraper/${requestId}`,
        ...opts,
      });
    },
    startMarkdownify(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/markdownify",
        ...opts,
      });
    },
    getMarkdownifyStatus({
      requestId, ...opts
    }) {
      return this._makeRequest({
        path: `/markdownify/${requestId}`,
        ...opts,
      });
    },
  },
};
