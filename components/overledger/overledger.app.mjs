import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "overledger",
  propDefinitions: {
    smartContractId: {
      type: "string",
      label: "Smart Contract ID",
      description: "The ID of the smart contract to interact with.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.overledger.io";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "API-Version": "3.0.0",
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    prepareSmartContractTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/preparations/transactions/smart-contracts/write",
        ...opts,
      });
    },
    executeSignedTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/executions/transactions",
        ...opts,
      });
    },
    createHook({
      path, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/webhooks/${path}`,
        ...opts,
      });
    },
    deleteHook({
      path, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/api/webhooks/${path}/${webhookId}`,
      });
    },
  },
};
