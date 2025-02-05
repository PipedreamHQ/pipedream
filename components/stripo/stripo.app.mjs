import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stripo",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "An ID of a template with the auto-generated area. Please note that this template should be yours (saved in the project you have access to), not a basic or a public one.",
      async options({ page }) {
        const { data } = await this.listTemplates({
          params: page,
        });
        return data?.map(({
          templateId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://my.stripo.email/emailgeneration/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Stripo-Api-Auth": this.$auth.api_key,
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
    createEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/email",
        ...opts,
      });
    },
  },
};
