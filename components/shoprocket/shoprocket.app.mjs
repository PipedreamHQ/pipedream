import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shoprocket",
  propDefinitions: {
    environment: {
      type: "string",
      label: "Environment",
      description: "The store environment in which you want to configure the webhook.",
      options: [
        "test",
        "live",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.shoprocket.io/v1";
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
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
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/customers",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
