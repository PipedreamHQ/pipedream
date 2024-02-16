import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formpress",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "Identifier of the form to watch for new submissions",
      async options() {
        const forms = await this.listForms();
        return forms?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.formpress.org/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    createWebhook({
      formId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/webhooks/subscribe`,
        ...opts,
      });
    },
    deleteWebhook({
      formId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/forms/${formId}/webhooks/unsubscribe`,
        ...opts,
      });
    },
    listForms(opts = {}) {
      return this._makeRequest({
        path: `/users/${this.$auth.oauth_uid}/forms`,
        ...opts,
      });
    },
  },
};
