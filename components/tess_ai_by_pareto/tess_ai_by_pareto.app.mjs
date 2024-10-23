import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tess_ai_by_pareto",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "AI Agent ID",
      description: "The ID of the AI Agent (template) to execute.",
      useQuery: true,
      async options({
        page = 0, query,
      }) {
        const response = await this.searchTemplates({
          params: {
            page: page + 1,
            q: query || undefined,
          },
        });
        return response?.data?.map((template) => ({
          label: template.title,
          value: template.id,
        }));
      },
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
    async executeTemplate({
      templateId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/templates/${templateId}/execute`,
        ...args,
      });
    },
    async getTemplate(templateId) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
      });
    },
    async searchTemplates(args) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    async getTemplateResponse({
      executionId, ...args
    }) {
      return this._makeRequest({
        path: `/template-responses/${executionId}`,
        ...args,
      });
    },
  },
};
