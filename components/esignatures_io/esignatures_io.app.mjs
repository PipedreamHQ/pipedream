import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "esignatures_io",
  propDefinitions: {
    templateId: {
      label: "Template ID",
      description: "The ID of the template",
      type: "string",
      async options() {
        const templates = await this.getTemplates();

        return templates.map((template) => ({
          label: template.template_name,
          value: template.template_id,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://esignatures.io/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._apiToken(),
          password: "",
        },
        ...args,
      });
    },
    async getTemplates(args) {
      const response = await this._makeRequest({
        path: "/templates",
        ...args,
      });

      return response.data;
    },
    async createContract(args) {
      const response = await this._makeRequest({
        path: "/contracts",
        method: "post",
        ...args,
      });

      return response.data;
    },
  },
};
