import { axios } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";
import { Scrapeless } from "@scrapeless-ai/sdk";

export default {
  type: "app",
  app: "scrapeless",
  methods: {
    _baseUrl() {
      return "https://api.scrapeless.com/api";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
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
    _scrapelessClient() {
      const { api_key } = this.$auth;
      if (!api_key) {
        throw new ConfigurationError("API key is required");
      }

      return new Scrapeless({
        apiKey: api_key,
        baseUrl: this._baseUrl(),
      });
    },
    submitScrapeJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/scraper/request",
        ...opts,
      });
    },
    getScrapeResult({ scrapeJobId }) {
      return this._makeRequest({
        path: `/v1/scraper/result/${scrapeJobId}`,
      });
    },
  },

};
