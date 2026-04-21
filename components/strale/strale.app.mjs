import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "strale",
  description: "Strale is the data layer for AI agents — 290+ quality-tested data capabilities including company verification, sanctions screening, VAT validation, invoice extraction, and more. [See the documentation](https://strale.dev/docs)",
  propDefinitions: {
    task: {
      type: "string",
      label: "Task",
      description: "A natural-language description of what you need (e.g. \"verify a Swedish company\", \"validate this VAT number\").",
    },
    capabilitySlug: {
      type: "string",
      label: "Capability Slug",
      description: "The slug of the capability to execute (e.g. `swedish-company-data`, `vat-validate`, `email-validate`). [See the catalog](https://strale.dev).",
    },
    inputs: {
      type: "object",
      label: "Inputs",
      description: "Input parameters for the capability as a JSON object (e.g. `{ \"vat_number\": \"SE556677889901\" }` or `{ \"email\": \"ops@example.com\" }`). The required fields depend on the capability being called.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
      default: 5,
    },
    maxPriceCents: {
      type: "integer",
      label: "Max Price (cents)",
      description: "Maximum price in euro cents you are willing to pay per execution.",
      optional: true,
    },
    dryRun: {
      type: "boolean",
      label: "Dry Run",
      description: "If `true`, validates the request and returns the matched capability without executing or charging.",
      optional: true,
      default: false,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.strale.io";
    },
    _headers() {
      const headers = {
        "Content-Type": "application/json",
      };
      const apiKey = this._apiKey();
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
      return headers;
    },
    async _makeRequest({
      $ = this, path, headers = {}, ...args
    }) {
      try {
        return await axios($, {
          url: `${this._baseUrl()}${path}`,
          ...args,
          headers: {
            ...this._headers(),
            ...headers,
          },
        });
      } catch (err) {
        // The Strale API returns HTTP 500 with a structured body for
        // execution-level failures (missing input fields, capability
        // timeouts, etc.). axios throws on non-2xx — without this catch,
        // Pipedream surfaces it as a generic "Internal server error".
        // Re-throw with the actual message + error_code so the workflow
        // UI shows something actionable.
        const data = err.response?.data;
        const message = data?.message ?? data?.error_code ?? err.message;
        const code = data?.error_code
          ? ` (${data.error_code})`
          : "";
        const status = err.response?.status ?? "";
        const statusLabel = status
          ? ` [HTTP ${status}]`
          : "";
        throw new Error(`Strale API error${statusLabel}${code}: ${message}`);
      }
    },
    suggest(args = {}) {
      return this._makeRequest({
        path: "/v1/suggest",
        method: "post",
        ...args,
      });
    },
    execute(args = {}) {
      return this._makeRequest({
        path: "/v1/do",
        method: "post",
        ...args,
      });
    },
    listCapabilities(args = {}) {
      return this._makeRequest({
        path: "/v1/capabilities",
        ...args,
      });
    },
    getQuality({
      slug, ...args
    } = {}) {
      return this._makeRequest({
        path: `/v1/quality/${slug}`,
        ...args,
      });
    },
  },
};
