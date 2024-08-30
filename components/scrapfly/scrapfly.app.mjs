import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scrapfly",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the web page to extract data from",
    },
    key: {
      type: "string",
      label: "API Key",
      description: "Your Scrapfly API key",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The content of the page you want to extract data from",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The content type of the document passed in the body",
      options: [
        "text/html",
        "text/markdown",
        "text/plain",
        "application/xml",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.scrapfly.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getSubscriptionAndUsageDetails() {
      return this._makeRequest({
        path: "/account",
      });
    },
    async extractWebPageContent({
      url, key, ...params
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/scrape?url=${encodeURIComponent(url)}&key=${key}`,
        params,
      });
    },
    async automateContentExtraction({
      key, body, contentType, ...params
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/extraction",
        headers: {
          "Content-Type": contentType,
        },
        data: body,
        params: {
          key,
          ...params,
        },
      });
    },
  },
};
