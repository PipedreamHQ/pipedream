import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flexisign",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to generate the document from",
      async options() {
        const { data: { list } } = await this.listTemplates();
        return list.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flexisign.io/v1";
    },
    _headers() {
      return {
        "api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates/all",
        ...opts,
      });
    },
    getTemplateDetails(opts = {}) {
      return this._makeRequest({
        path: "/template",
        ...opts,
      });
    },
    sendSignatureRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/template/create-document",
        ...opts,
      });
    },
  },
};
