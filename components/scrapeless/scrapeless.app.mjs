import { axios } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";
import {
  buildAiScraperTransportError, getAiScraperRequestContext, sanitizeAiScraperHttpError,
} from "./common/ai-scraper-response.mjs";

export default {
  type: "app",
  app: "scrapeless",
  methods: {
    async _makeAiScraperRequest({
      $, method, path, data,
    }) {
      const apiKey = this.$auth?.api_key;
      if (typeof apiKey !== "string" || !apiKey.trim()) {
        throw new ConfigurationError("A Scrapeless API key is required.");
      }
      try {
        return await axios(getAiScraperRequestContext($), {
          method,
          url: `https://api.scrapeless.com/api/v2/scraper${path}`,
          headers: {
            "x-api-token": apiKey,
            "Content-Type": "application/json",
          },
          ...(data !== undefined && {
            data,
          }),
          timeout: 30000,
          maxRedirects: 0,
        });
      } catch (error) {
        if (error.response) throw sanitizeAiScraperHttpError(error);
        throw buildAiScraperTransportError(error, {
          method,
        });
      }
    },
    createAiScraperTask({
      $, data,
    }) {
      return this._makeAiScraperRequest({
        $,
        method: "POST",
        path: "/request",
        data,
      });
    },
    getAiScraperResult({
      $, taskId,
    }) {
      return this._makeAiScraperRequest({
        $,
        method: "GET",
        path: `/result/${encodeURIComponent(taskId)}`,
      });
    },
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
    async _scrapelessClient() {
      process.env.SCRAPELESS_IS_ONLINE = "true";
      process.env.SCRAPELESS_LOG_ROOT_DIR = "/tmp";

      const { Scrapeless } = await import("@scrapeless-ai/sdk");

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
