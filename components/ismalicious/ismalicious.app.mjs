import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import { isIP } from "node:net";

export default {
  type: "app",
  app: "ismalicious",
  propDefinitions: {
    indicator: {
      type: "string",
      label: "Indicator",
      description: "The exact indicator to enrich. Inputs are sent to the hosted isMalicious API and consume the connected account's request quota.",
    },
  },
  methods: {
    /**
     * Enrich one IP, domain, URL or MD5/SHA-1/SHA-256 file hash.
     * @param {object} opts - Request context and indicator.
     * @param {object} opts.$ - Pipedream execution context.
     * @param {string} opts.indicator - Original indicator value.
     * @param {string} opts.indicatorType - Input kind for preflight validation.
     * @returns {Promise<object>} Unmodified reputation and evidence response.
     */
    async checkIndicator({
      $, indicator, indicatorType,
    }) {
      if (typeof indicator !== "string" || !indicator.trim()) {
        throw new ConfigurationError("Enter a non-empty indicator.");
      }
      if (indicator !== indicator.trim()) {
        throw new ConfigurationError("Remove leading or trailing whitespace from the indicator.");
      }
      if (indicatorType === "ip" && !isIP(indicator)) {
        throw new ConfigurationError("Enter a valid IPv4 or IPv6 address.");
      }
      if (indicatorType === "domain" && (isIP(indicator) || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.?$/i.test(indicator) || indicator.length > 253)) {
        throw new ConfigurationError("Enter a fully qualified ASCII domain name (use punycode for internationalized names).");
      }
      if (indicatorType === "url") {
        let url;
        try {
          url = new URL(indicator);
        } catch {
          throw new ConfigurationError("Enter a valid HTTP or HTTPS URL.");
        }
        if (![
          "http:",
          "https:",
        ].includes(url.protocol) || url.username || url.password) {
          throw new ConfigurationError("Use an HTTP or HTTPS URL without embedded credentials.");
        }
      }
      if (indicatorType === "hash" && !/^(?:[a-f0-9]{32}|[a-f0-9]{40}|[a-f0-9]{64})$/i.test(indicator)) {
        throw new ConfigurationError("Enter an MD5, SHA-1 or SHA-256 file hash.");
      }
      const {
        api_key: apiKey, api_secret: apiSecret,
      } = this.$auth ?? {};
      if (!apiKey || !apiSecret) {
        throw new ConfigurationError("Connect an isMalicious account with both API key and API secret.");
      }
      const credential = Buffer.from(`${apiKey}:${apiSecret}`, "utf8").toString("base64");
      const response = await axios($, {
        method: "GET",
        url: "https://api.ismalicious.com/check",
        headers: {
          "X-API-KEY": credential,
          "Accept": "application/json",
        },
        params: {
          query: indicator,
          enrichment: "standard",
        },
        timeout: 30000,
        maxRedirects: 0,
      });
      if (!response || typeof response !== "object" || Array.isArray(response)) {
        throw new Error("isMalicious returned an invalid response; no reputation verdict is available.");
      }
      return response;
    },
  },
};
