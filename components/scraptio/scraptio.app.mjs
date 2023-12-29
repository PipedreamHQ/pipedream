import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scraptio",
  version: "0.0.{{ts}}",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL to Scrape",
      description: "The complete URL of the website you want to scrape.",
    },
    filters: {
      type: "string[]",
      label: "Filters",
      description: "A list of selectors to filter the HTML elements you want to scrape. (e.g., ['#id', '.class'])",
      optional: true,
    },
    matchAll: {
      type: "boolean",
      label: "Match All Filters",
      description: "Indicates if the element must match all provided filters.",
      optional: true,
      default: false,
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your Scraptio API Key.",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.scraptio.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, headers, data, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
          ...headers,
        },
        data,
        ...otherOpts,
      });
    },
    async scrape({
      url, filters, matchAll,
    }) {
      const body = {
        url,
        filters: filters || [],
        match_all: matchAll || false,
      };

      return this._makeRequest({
        path: "/scrape",
        data: body,
      });
    },
  },
};
