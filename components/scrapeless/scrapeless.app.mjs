import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scrapeless",
  methods: {
    _baseUrl() {
      return "https://api.scrapeless.com/api/v1";
    },
    _headers() {
      return {
        "x-api-token": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    submitScrapeJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/scraper/request",
        ...opts,
      });
    },
    getScrapeResult({ scrapeJobId }) {
      return this._makeRequest({
        path: `/scraper/result/${scrapeJobId}`,
      });
    },
  },
};
