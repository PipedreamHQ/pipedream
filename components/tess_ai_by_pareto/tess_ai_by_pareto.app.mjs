import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tess_ai_by_pareto",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "AI Template ID",
      description: "The ID of the AI template to execute or retrieve details for.",
      async options() {
        const templates = await this.searchAiTemplates({
          query: "",
        });
        return templates.templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    executionId: {
      type: "string",
      label: "AI Execution ID",
      description: "The ID of the AI template execution to retrieve the result for.",
      async options() {
        const executions = await this.listExecutions();
        return executions.executions.map((execution) => ({
          label: execution.id,
          value: execution.id,
        }));
      },
    },
    typeFilter: {
      type: "string",
      label: "Template Type",
      description: "Filter templates by type (image, text, video).",
      optional: true,
      options: [
        {
          label: "Image",
          value: "image",
        },
        {
          label: "Text",
          value: "text",
        },
        {
          label: "Video",
          value: "video",
        },
      ],
    },
    inputs: {
      type: "string[]",
      label: "Inputs",
      description: "An array of JSON strings representing inputs for the template execution.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://tess.pareto.io/api";
    },
    async _makeRequest({
      $ = this, path = "/", headers, ...otherOpts
    } = {}) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
        ...otherOpts,
      });
    },
    async executeAiTemplate({
      templateId, inputs,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/ai-templates/${templateId}/execute`,
        data: {
          inputs: inputs
            ? inputs.map((input) => JSON.parse(input))
            : [],
        },
      });
    },
    async getAiTemplateDetails({ templateId }) {
      return this._makeRequest({
        method: "GET",
        path: `/ai-templates/${templateId}`,
      });
    },
    async searchTemplates(args) {
      return this._makeRequest({
        method: "GET",
        path: "/templates",
        ...args,
      });
    },
    async getAiTemplateResult({ executionId }) {
      return this._makeRequest({
        method: "GET",
        path: `/ai-executions/${executionId}/result`,
      });
    },
    async listExecutions(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/ai-executions",
        ...opts,
      });
    },
  },
};
