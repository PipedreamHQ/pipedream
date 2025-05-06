import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mergemole",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The identifier of a template",
      async options() {
        const templates = await this.listTemplates();
        return templates?.map(({
          id: value, label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://mergemole.com/api";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-token": `${this.$auth.api_key}`,
          "x-api-secret": `${this.$auth.secret_key}`,
        },
        ...opts,
      });
    },
    generatePdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pdf/generate",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/template-files",
        ...opts,
      });
    },
    getTemplateVariables({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/template-variables-action/${templateId}`,
        ...opts,
      });
    },
  },
};
