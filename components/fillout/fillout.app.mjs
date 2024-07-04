import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fillout",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form",
      async options() {
        const forms = await this.getForms();
        return forms.map((form) => ({
          label: form.name,
          value: form.formId,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fillout.com/v1/api";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
    getForms() {
      return this._makeRequest({
        path: "/forms",
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/create",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/delete",
        ...opts,
      });
    },
  },
};
