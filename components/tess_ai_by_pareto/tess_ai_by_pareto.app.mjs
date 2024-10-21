import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tess_ai_by_pareto",
  version: "0.0.{{ts}}",
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
    query: {
      type: "string",
      label: "Search Query",
      description: "The search query to find AI templates based on specific criteria.",
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
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://tess.pareto.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($ || this, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
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
    async searchAiTemplates({
      query, typeFilter,
    }) {
      const params = {
        query,
      };
      if (typeFilter) {
        params.type = typeFilter;
      }
      return this._makeRequest({
        method: "GET",
        path: "/ai-templates/search",
        params,
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
    async paginate(fn, ...opts) {
      let results = [];
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        if (response.items && response.items.length > 0) {
          results.push(...response.items);
          hasMore = response.hasMore;
          page += 1;
        } else {
          hasMore = false;
        }
      }

      return results;
    },
  },
};
