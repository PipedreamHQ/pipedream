import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zenrows",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "Encoded URL to scrape",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.zenrows.com/v1";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          ...args.params,
          apikey: this._apiKey(),
        },
      });
    },
    scrapeUrl(args = {}) {
      return this._makeRequest({
        path: "/",
        ...args,
      });
    },
    getAPIUsage(args = {}) {
      return this._makeRequest({
        path: "/usage",
        ...args,
      });
    },
  },
};
