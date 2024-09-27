import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "moaform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to monitor for new submissions",
      async options() {
        const forms = await this.getForms();
        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
    fields: {
      type: "string[]",
      label: "Fields to Capture",
      description: "Optional fields to capture from the submission",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.moaform.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getForms(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/forms",
      });
    },
    async createWebhook(opts = {}) {
      const {
        formId, url, fields,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/webhooks`,
        data: {
          url,
          fields,
        },
      });
    },
    async deleteWebhook(opts = {}) {
      const {
        formId, webhookId,
      } = opts;
      return this._makeRequest({
        method: "DELETE",
        path: `/forms/${formId}/webhooks/${webhookId}`,
      });
    },
    async getWebhooks(opts = {}) {
      const { formId } = opts;
      return this._makeRequest({
        path: `/forms/${formId}/webhooks`,
      });
    },
  },
};
