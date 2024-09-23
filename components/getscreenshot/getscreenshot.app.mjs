import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rasterwise",
  version: "0.0.{ts}",
  propDefinitions: {
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "The URL of the website to capture a screenshot from.",
    },
    elementSelector: {
      type: "string",
      label: "Element Selector",
      description: "CSS selector of the element to capture in the screenshot.",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address to send the screenshot to.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rasterwise.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", params = {}, headers, ...otherOpts
      } = opts;
      params.apikey = this.$auth.api_key;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        params,
        headers: {
          ...headers,
        },
      });
    },
    async getScreenshot() {
      const {
        websiteUrl, elementSelector, emailAddress,
      } = this;
      const params = {
        url: websiteUrl,
      };
      if (elementSelector) params.element = elementSelector;
      if (emailAddress) params.email = emailAddress;
      return this._makeRequest({
        path: "/get-screenshot",
        params,
      });
    },
  },
};
