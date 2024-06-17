import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "repliq",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template you want to deploy.",
      async options() {
        const templates = await this.listTemplates();
        if (templates.error) return [];

        return templates.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.repliq.co/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    getCreditsCount(opts = {}) {
      return this._makeRequest({
        path: "/getCreditsCount",
        ...opts,
      });
    },
    listTemplates() {
      return this._makeRequest({
        path: "/getTemplateList",
      });
    },
    launchTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/launchTemplate",
        ...opts,
      });
    },
  },
};
