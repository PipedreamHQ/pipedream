import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docuwriter_ai",
  propDefinitions: {
    sourceCode: {
      type: "string",
      label: "Source Code",
      description: "The raw source code to process",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename for context (e.g., `UserService.php`)",
    },
    additionalInstructions: {
      type: "string",
      label: "Additional Instructions",
      description: "Optional extra instructions for the AI generation",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.docuwriter.ai/api";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async _makeRequest($, opts = {}) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${opts.path}`,
        headers: this._headers(),
      });
    },
    async makeGenerationRequest($, { endpoint, data }) {
      return this._makeRequest($, {
        method: "POST",
        path: endpoint,
        data,
      });
    },
    async listGenerations($, params = {}) {
      return this._makeRequest($, {
        method: "GET",
        path: "/generations",
        params,
      });
    },
  },
};
