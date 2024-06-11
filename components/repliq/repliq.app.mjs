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
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.repliq.co/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.token || this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async getCreditsCount() {
      return this._makeRequest({
        path: "/getCreditsCount",
      });
    },
    async listTemplates() {
      return this._makeRequest({
        path: "/templateList",
      });
    },
    async launchRepliqProcess({ templateId }) {
      return this._makeRequest({
        method: "POST",
        path: "/deployTemplate",
        data: {
          templateId,
        },
      });
    },
  },
};
