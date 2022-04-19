import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tally",
  propDefinitions: {
    forms: {
      label: "Form",
      description: "Select a form",
      type: "string",
      async options() {
        const forms = await this.getForms();

        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.tally.so";
    },
    async _makeRequest(path, options = {}, $ = undefined) {
      return await axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async _createWebhook(data) {
      return await this._makeRequest("webhooks", {
        method: "post",
        data: {
          ...data,
          externalSubscriber: "PIPEDREAM",
        },
      });
    },
    async _removeWebhook(webhookId) {
      return await this._makeRequest(`webhooks/${webhookId}`, {
        method: "delete",
      });
    },
    async getForms({ $ } = {}) {
      return this._makeRequest("forms", {}, $);
    },
    async getResponses({
      formId, page, $,
    } = {}) {
      return this._makeRequest(`forms/${formId}/responses`, {
        params: {
          page,
        },
      }, $);
    },
    async getFormFields({
      formId, $,
    } = {}) {
      return this._makeRequest("integrations/output-fields", {
        params: {
          formId,
          integrationType: "PIPEDREAM",
        },
      }, $);
    },
  },
};
