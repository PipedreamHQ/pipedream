import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "codeclassify",
  propDefinitions: {
    query: {
      type: "string",
      label: "Search Query",
      description: "A plain-English description to classify.",
    },
    limit: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return.",
      optional: true,
      default: 15,
      min: 1,
    },
  },
  methods: {
    _baseUrl() {
      // Production API host for CodeClassify (single source of truth for the base URL).
      // The human-facing API docs live at https://code-classify.com/api/ ; the API itself
      // is served from this Cloudflare Worker origin.
      return "https://codeclassify-api.rosariovitale0096.workers.dev";
    },
    _headers() {
      return {
        "X-Api-Key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    async validateVat(args = {}) {
      return this._makeRequest({
        path: "/v1/vat/validate",
        method: "POST",
        ...args,
      });
    },
    async validateGtin(args = {}) {
      return this._makeRequest({
        path: "/v1/gtin/validate",
        method: "POST",
        ...args,
      });
    },
    async validateIban(args = {}) {
      return this._makeRequest({
        path: "/v1/iban/validate",
        method: "POST",
        ...args,
      });
    },
    async searchNaics(args = {}) {
      return this._makeRequest({
        path: "/v1/naics/search",
        method: "GET",
        ...args,
      });
    },
    async searchHsCode(args = {}) {
      return this._makeRequest({
        path: "/v1/hs/search",
        method: "GET",
        ...args,
      });
    },
  },
};
