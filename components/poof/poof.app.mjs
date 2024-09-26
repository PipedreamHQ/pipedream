import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "poof",
  methods: {
    _baseUrl() {
      return "https://www.poof.io/api";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        method: "POST",
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/v1/create_webhook",
        ...args,
      });
    },
    listTransactions(args = {}) {
      return this._makeRequest({
        path: "/v1/fetch_transactions",
        ...args,
      });
    },
    createDepositAddress(args = {}) {
      return this._makeRequest({
        path: "/v2/create_charge",
        ...args,
      });
    },
    sendTransaction(args = {}) {
      return this._makeRequest({
        path: "/v2/payouts",
        ...args,
      });
    },
  },
};
