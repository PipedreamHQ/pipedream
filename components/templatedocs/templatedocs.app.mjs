import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "templatedocs",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template",
      description: "The unique identifier of the template",
      async options({ page }) {
        const { templates } = await this.listTemplates({
          params: {
            pageIndex: page + 1,
          },
        });
        return templates.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://templatedocs.io/api/v1";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    getTemplate({
      templateId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
        ...opts,
      });
    },
    deleteTemplate({
      templateId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/templates/${templateId}`,
        ...opts,
      });
    },
    generateDocument({
      templateId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/templates/${templateId}/generate`,
        ...opts,
      });
    },
  },
};
