import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "documint",
  propDefinitions: {
    templateId: {
      label: "Template ID",
      description: "The template ID",
      type: "string",
      async options({ page }) {
        const { data: templates } = await this.getTemplates({
          params: {
            page: page + 1,
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
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.documint.me/1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "api_key": this._apiKey(),
        },
      });
    },
    async createDocument({
      templateId, ...args
    }) {
      return this._makeRequest({
        path: `/templates/${templateId}/content`,
        method: "post",
        ...args,
      });
    },
    async getTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
  },
};
