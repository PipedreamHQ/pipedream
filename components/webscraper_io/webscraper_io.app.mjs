import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "webscraper_io",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.webscraper.io/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          api_token: this.$auth.api_key,
        },
        ...args,
      });
    },
    getScrapingJobs(args = {}) {
      return this._makeRequest({
        path: "/scraping-jobs",
        ...args,
      });
    },
  },
};
