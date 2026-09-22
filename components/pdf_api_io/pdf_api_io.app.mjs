import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdf_api_io",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template",
      async options() {
        const templates = await this.listTemplates();
        return templates?.map((template) => ({
          label: template.name,
          value: template.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://pdf-api.io/api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    getTemplate({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    renderTemplate({
      templateId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/templates/${templateId}/pdf`,
        ...opts,
      });
    },
    mergeTemplates(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/templates/merge",
        ...opts,
      });
    },
  },
};
