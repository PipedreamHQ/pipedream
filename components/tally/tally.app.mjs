import { axios } from "@pipedream/platform";
import contants from "./contants.mjs";

export default {
  type: "app",
  app: "tally",
  propDefinitions: {
    form: {
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
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async createWebhook(data) {
      return this._makeRequest("webhooks", {
        method: "post",
        data: {
          ...data,
          externalSubscriber: contants.EXTERNAL_SUBSCRIBER,
        },
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest(`webhooks/${webhookId}`, {
        method: "delete",
      });
    },
    async getForms({ $ } = {}) {
      return this._makeRequest("forms", {}, $);
    },
    async getResponses({
      formId, $,
    }) {
      let allResponses = [];
      let page = 1;

      while (page > 0) {
        const responses = await this._makeRequest(`forms/${formId}/responses`, {
          params: {
            page,
          },
        }, $);

        if (responses.length > 0) {
          allResponses = allResponses.concat(responses);
          page++;
        } else {
          page = 0;
        }
      }

      return allResponses;
    },
    async getFormFields({
      formId, $,
    }) {
      return this._makeRequest("integrations/output-fields", {
        params: {
          formId,
          integrationType: contants.EXTERNAL_SUBSCRIBER,
        },
      }, $);
    },
  },
};
