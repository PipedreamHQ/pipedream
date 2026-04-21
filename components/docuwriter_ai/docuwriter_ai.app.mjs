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
    _makeRequest({
      $ = this, path, headers, ...opts
    } = {}) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
      });
    },
    generateCodeOptimization(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generate-code-optimization",
        ...opts,
      });
    },
    generateCodeDocumentation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generate-code-documentation",
        ...opts,
      });
    },
    generateCodeTests(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generate-code-tests",
        ...opts,
      });
    },
    generateSwaggerApi(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generate-swagger-api",
        ...opts,
      });
    },
    generateUmlDiagram(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generate-uml-diagram",
        ...opts,
      });
    },
    listGenerations(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/generations",
        ...opts,
      });
    },
  },
};
