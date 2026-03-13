import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formsite",
  propDefinitions: {
    formDir: {
      type: "string",
      label: "Form",
      description: "The form to receive webhook events for.",
      async options() {
        const { forms } = await this.getForms();
        return forms.map((form) => ({
          label: `${form.name}`,
          value: form.directory,
        }));
      },
    },
  },
  methods: {
    _getHeaders(headers = {}) {
      return {
        "Authorization": `bearer ${this.$auth.access_token}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _getBaseUrl() {
      const {
        server, user_id,
      } = this.$auth;
      return `https://${server}.formsite.com/api/v2/${user_id}`;
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._getBaseUrl()}${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      });
    },
    getForms() {
      return this._makeRequest({
        path: "/forms",
      });
    },
    createWebhook({
      formDir, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formDir}/webhooks`,
        ...opts,
      });
    },
    deleteWebhook({
      formDir, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/forms/${formDir}/webhooks`,
        ...opts,
      });
    },
  },
};
