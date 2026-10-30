import { AI_SCRAPER_ACTORS } from "./common/constants.mjs";
import { axios } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";
import {
  buildAiScraperTransportError, getAiScraperRequestContext, sanitizeAiScraperHttpError,
} from "./common/ai-scraper-response.mjs";

export default {
  type: "app",
  app: "scrapeless",
  propDefinitions: {
    aiScraperActor: {
      type: "string",
      label: "AI Engine",
      description: "AI engine to run, e.g. `scraper.chatgpt`. Copilot and Grok require a mode in Engine Options.",
      options: AI_SCRAPER_ACTORS,
    },
    aiScraperPrompt: {
      type: "string",
      label: "Prompt",
      description: "Question to send, e.g. `Explain how solar panels generate electricity.` Required with Country unless using AI Mode URL; omit in URL mode.",
      optional: true,
    },
    aiScraperCountry: {
      type: "string",
      label: "Country",
      description: "Two-letter country code, e.g. `US`. Required in prompt mode; omit in AI Mode URL mode. Availability depends on the engine and your account.",
      optional: true,
    },
    aiScraperAiModeUrl: {
      type: "string",
      label: "AI Mode URL",
      description: "Complete HTTPS Google AI Mode access link, e.g. `https://www.google.com/search?udm=50&q=Best+Google+AI+Mode+Scraper`. See the [official example](https://www.scrapeless.com/en/product/web-scraper/google-ai-mode). Only for Google AI Mode: omit Prompt, Country, and Engine Options. The link is sent unchanged; this action requires HTTPS and no URL credentials.",
      optional: true,
    },
    aiScraperEngineOptions: {
      type: "object",
      label: "Engine Options",
      description: "Engine-specific JSON object, e.g. `{\"web_search\":true,\"shopping\":false}` for ChatGPT. ChatGPT: {\"web_search\":true,\"shopping\":false,\"should_fetch_share_link\":false}; Perplexity: {\"web_search\":true,\"should_fetch_share_link\":false}; Copilot: {\"mode\":\"search\",\"should_fetch_share_link\":false} (mode required: search, smart, chat, reasoning, study); Gemini: {\"shopping\":false}; AI Mode/Overview: {\"shopping\":false,\"location\":\"New York,New York,United States\",\"should_fetch_share_link\":false} (uule may replace location; use a valid w+ name or a+ GPS encoding); Grok: {\"mode\":\"MODEL_MODE_AUTO\",\"should_fetch_share_link\":false} (mode required: MODEL_MODE_FAST, MODEL_MODE_EXPERT, MODEL_MODE_AUTO); Alexa: {}. Omit in URL mode. Booleans must be JSON booleans. Unknown fields are rejected. Shopping defaults to false in prompt mode for supported engines; enabling it can increase charges.",
      optional: true,
    },
  },
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
     * @param {number} [options.timeout=30000] Request timeout in milliseconds.
     * @param {AbortSignal} [options.signal] Optional cancellation at the polling deadline.
     * @returns {Promise<object>} Original JSON response from the API.
     * @throws {Error} If authentication is missing or the HTTP request fails.
     */
    async _makeAiScraperRequest({
      $, method, path, data, timeout = 30000, signal,
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
          timeout,
          signal,
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
     * @param {number} [options.timeout=30000] Timeout bounded by the remaining wait budget.
     * @param {AbortSignal} [options.signal] Optional cancellation at the polling deadline.
     * @returns {Promise<object>} Original task status and any result payload.
     */
    getAiScraperResult({
      $, taskId, timeout, signal,
    }) {
      return this._makeAiScraperRequest({
        $,
        method: "GET",
        timeout,
        signal,
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
