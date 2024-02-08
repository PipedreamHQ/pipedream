import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formpress",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "API Key for your FormPress account",
      secret: true,
    },
    expiryDate: {
      type: "string",
      label: "Expiry Date",
      description: "Expiry date for the token in Unix time",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "User ID returned from create-token request",
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "Form ID to use for the request",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "URL of your webhook",
    },
    webhookId: {
      type: "string",
      label: "Webhook ID",
      description: "ID of your webhook",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.formpress.org/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
    },
    async createToken({
      apiKey, expiryDate,
    }) {
      const data = expiryDate
        ? {
          APIKey: apiKey,
          exp: expiryDate,
        }
        : {
          APIKey: apiKey,
        };
      return this._makeRequest({
        method: "POST",
        path: "/create-token",
        data,
      });
    },
    async getForms({
      userId, token,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/users/${userId}/forms`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    async getFormFields({
      userId, formId, token,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/users/${userId}/forms/${formId}/elements`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    async subscribeWebhook({
      formId, webhookUrl, token,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/webhooks/subscribe`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          webhookUrl,
        },
      });
    },
    async unsubscribeWebhook({
      formId, webhookId, token,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/forms/${formId}/webhooks/unsubscribe`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          webhookId,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
