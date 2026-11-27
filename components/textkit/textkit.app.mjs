import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "textkit",
  propDefinitions: {
    from: {
      type: "string",
      label: "From",
      description: "One of your TextKit numbers in E.164 format (e.g. `+15005550100`), or a sender pool ID (e.g. `pool_a1B2c3D4`). Use **List Numbers** to find your numbers (the `phone_number` field) and **List Sender Pools** to find pool IDs (the `id` field). Optional when your account has exactly one number.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number to verify, in E.164 format (e.g. `+14155550132`). In the sandbox, `+15005550006` always succeeds.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.jointextkit.com/v1";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "User-Agent": "pipedream-textkit",
          ...headers,
        },
        ...args,
      });
    },
    sendMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...args,
      });
    },
    listMessages(args = {}) {
      return this._makeRequest({
        path: "/messages",
        ...args,
      });
    },
    listNumbers(args = {}) {
      return this._makeRequest({
        path: "/numbers",
        ...args,
      });
    },
    listSenderPools(args = {}) {
      return this._makeRequest({
        path: "/numbers/pools",
        ...args,
      });
    },
    startVerification(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verify",
        ...args,
      });
    },
    checkVerification(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verify/check",
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${encodeURIComponent(webhookId)}`,
        ...args,
      });
    },
  },
};
