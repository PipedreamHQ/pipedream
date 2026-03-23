import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "templatefox",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template",
      description: "The template to use for PDF generation",
      async options() {
        const { templates } = await this.listTemplates();
        return templates.map((t) => ({
          label: t.name,
          value: t.id,
        }));
      },
    },
    data: {
      type: "object",
      label: "Template Data",
      description: "Key-value pairs to populate the template. Keys must match the template's variable names.",
    },
    expiration: {
      type: "integer",
      label: "URL Expiration (seconds)",
      description: "How long the download URL stays valid. Min 60 (1 min), max 604800 (7 days).",
      default: 86400,
      min: 60,
      max: 604800,
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Custom filename for the generated PDF (without `.pdf` extension). Only letters, numbers, hyphens, underscores, and dots.",
      optional: true,
    },
  },
  methods: {
    /**
     * @returns {string} The base URL for the TemplateFox API
     */
    _baseUrl() {
      return "https://api.pdftemplateapi.com/v1";
    },
    /**
     * @returns {object} Default headers including API key authentication
     */
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    /**
     * Formats API error details into a human-readable string.
     * Handles string errors, FastAPI validation arrays, and unknown formats.
     * @param {string|Array|object} detail - The error detail from the API response
     * @returns {string} Formatted error message
     */
    _formatError(detail) {
      if (typeof detail === "string") {
        return detail;
      }
      if (Array.isArray(detail)) {
        return detail.map((e) => {
          const field = e.loc?.slice(1).join(".") || "unknown";
          return `${field}: ${e.msg}`;
        }).join("; ");
      }
      return JSON.stringify(detail);
    },
    /**
     * Makes an authenticated HTTP request to the TemplateFox API.
     * @param {object} opts - Request options
     * @param {object} [opts.$=this] - The Pipedream step context
     * @param {string} opts.path - API path (e.g., "/templates")
     * @param {string} [opts.method=GET] - HTTP method
     * @param {object} [opts.body] - Request body
     * @param {object} [opts.params] - Query parameters
     * @returns {Promise<object>} API response data
     */
    async _makeRequest({
      $ = this, path, method = "GET", body, params,
    }) {
      try {
        return await axios($, {
          url: `${this._baseUrl()}${path}`,
          method,
          headers: this._headers(),
          data: body,
          params,
        });
      } catch (error) {
        const detail = error?.response?.data?.detail;
        if (detail) {
          throw new Error(this._formatError(detail));
        }
        throw error;
      }
    },
    /**
     * Retrieves account information. Used by Pipedream to test auth.
     * @param {object} [args={}] - Additional request options
     * @returns {Promise<object>} Account details (email, credits)
     */
    async getAccount(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/account",
      });
    },
    /**
     * Lists all templates in the user's account.
     * @param {object} [args={}] - Additional request options
     * @returns {Promise<object>} Object with `templates` array
     */
    async listTemplates(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/templates",
      });
    },
    /**
     * Retrieves the field definitions for a specific template.
     * @param {object} opts - Options
     * @param {string} opts.templateId - The template ID
     * @returns {Promise<Array>} Array of field definitions
     */
    async getTemplateFields({
      templateId, ...args
    }) {
      return this._makeRequest({
        ...args,
        path: `/templates/${templateId}/fields`,
      });
    },
    /**
     * Generates a PDF from a template with dynamic data.
     * @param {object} [args={}] - Additional request options (must include `body`)
     * @returns {Promise<object>} Response with `url` and `credits_remaining`
     */
    async generatePDF(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/pdf/create",
        method: "POST",
      });
    },
  },
};
