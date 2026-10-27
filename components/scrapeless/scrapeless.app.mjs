import { axios } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";
import {
  buildAiScraperTransportError, getAiScraperRequestContext, sanitizeAiScraperHttpError,
} from "./common/ai-scraper-response.mjs";

export default {
  type: "app",
  app: "scrapeless",
  methods: {
    /**
     * Send one authenticated AI Scraper v2 request without retries or redirects.
     * Strip request configuration from errors and retain API response diagnostics.
     *
     * @param {object} options Request options.
     * @param {object} [options.$] Pipedream step context for diagnostic exports.
     * @param {string} options.method HTTP request method.
     * @param {string} options.path Relative AI Scraper endpoint path.
     * @param {object} [options.data] Creation payload; omitted for result queries.
     * @returns {Promise<object>} Original JSON response from the API.
     * @throws {Error} If authentication is missing or the HTTP request fails.
     */
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
    /**
     * Submit one asynchronous task; do not repeat an uncertain creation request.
     *
     * @param {object} options Task creation options.
     * @param {object} [options.$] Pipedream step context for diagnostic exports.
     * @param {object} options.data Validated actor, input, and optional webhook.
     * @returns {Promise<object>} Original creation response containing task_id.
     */
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
    /**
     * Fetch an existing task once, encoding its identifier as one path segment.
     *
     * @param {object} options Result lookup options.
     * @param {object} [options.$] Pipedream step context for diagnostic exports.
     * @param {string} options.taskId Validated identifier from task creation.
     * @returns {Promise<object>} Original task status and any result payload.
     */
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
