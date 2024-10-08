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
    //Sanbox base URL
    _sanboxBaseUrl() {
      return "https://api.sandbox.overledger.io";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "API-Version": "3.0.0",
      };
    },
    _makeRequest({
      $ = this, baseUrl, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: baseUrl + path,
        headers: this._headers(),
      });
    },
    prepareSmartContractTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        baseUrl: this._sanboxBaseUrl(),
        path: "/api/preparations/transactions/smart-contracts/write",
        ...opts,
      });
    },
    readFromSmartContract(opts = {}) {
      return this._makeRequest({
        method: "POST",
        baseUrl: this._sanboxBaseUrl(),
        path: "/api/smart-contracts/read",
        ...opts,
      });
    },
    signTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        baseUrl: this._sanboxBaseUrl(),
        path: "/api/transaction-signing-sandbox",
        ...opts,
      });
    },
    executeSignedTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        baseUrl: this._baseUrl(),
        path: "/api/executions/transactions",
        ...opts,
      });
    },
    createHook({
      path, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        baseUrl: this._baseUrl(),
        path: `/api/webhooks/${path}`,
        ...opts,
      });
    },
    deleteHook({
      path, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        baseUrl: this._baseUrl(),
        path: `/api/webhooks/${path}/${webhookId}`,
      });
    },
  },
};
