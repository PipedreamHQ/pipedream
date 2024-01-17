import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zenrows",
  version: "0.0.{{ts}}",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "Encoded URL to scrape",
    },
    cssSelectors: {
      type: "string[]",
      label: "CSS Selectors",
      description: "List of CSS selectors to extract specific data from the webpage",
      optional: true,
      async options({ prevContext }) {
        // This is a placeholder for an async options method.
        // Replace this with actual logic for fetching CSS selectors if an API endpoint is available.
        // Otherwise, this method can be omitted if the endpoint does not exist.
        return []; // Return an empty array if dynamic options are not applicable.
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.zenrows.com/v1";
    },
    async _makeRequest({
      $ = this, path, method = "GET", headers, params = {}, data, ...otherOpts
    }) {
      return axios($, {
        method,
        url: `${this._apiUrl()}${path}`,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this._apiKey()}`,
        },
        params,
        data,
        ...otherOpts,
      });
    },
    async scrapeUrl({
      url, cssSelectors, ...otherOpts
    }) {
      const params = {
        url,
        ...(cssSelectors && {
          css_selectors: cssSelectors.join(","),
        }),
        ...otherOpts.params,
      };
      return this._makeRequest({
        path: "/",
        params,
        ...otherOpts,
      });
    },
    async getAPIUsage({ ...otherOpts } = {}) {
      return this._makeRequest({
        path: "/usage",
        ...otherOpts,
      });
    },
  },
};
