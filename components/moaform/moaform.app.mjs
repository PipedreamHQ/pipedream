import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "moaform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to monitor for new submissions",
      async options({ page }) {
        const { items } = await this.getForms({
          params: {
            page: page + 1,
          },
        });
        return items.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.moaform.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
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
    getForms(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/forms",
      });
    },
    createWebhook({
      formId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/webhooks`,
        ...opts,
      });
    },
    deleteWebhook({
      formId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/forms/${formId}/webhooks/${webhookId}`,
      });
    },
  },
};
