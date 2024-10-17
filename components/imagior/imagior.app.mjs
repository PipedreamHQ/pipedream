import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "imagior",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The unique ID of the design template to use",
      async options() {
        const templates = await this.listTemplates();
        return templates?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.imagior.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates/all",
        ...opts,
      });
    },
    listTemplateElements({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/templates/${templateId}/elements`,
        ...opts,
      });
    },
    generateImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/image/generate",
        ...opts,
      });
    },
  },
};
