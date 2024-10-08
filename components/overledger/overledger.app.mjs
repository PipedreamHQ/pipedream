import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "overledger",
  props: { //Options to allow for instance selection of Overledger environment - Sanbox or Live Overledger ro determine BaseURL
    environment: {
      type: "string",
      label: "Overledger Instance",
      description: "Select the Overledger environment.",
      options: [
        {
          label: "Sandbox",
          value: "sandbox",
        },
        {
          label: "Overledger",
          value: "overledger",
        },
      ],
      optional: false,
    },
  },
  propDefinitions: {
    smartContractId: {
      type: "string",
      label: "Smart Contract ID",
      description: "The ID of the smart contract to interact with.",
    },
  },
  methods: {
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "API-Version": "3.0.0",
      };
    },
    _getBaseUrl() { //conditional to for environment selection.
      return this.environment === "sandbox"
        ? "https://api.sandbox.overledger.io"
        : "https://api.overledger.io";
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
        baseUrl: this._getBaseUrl(),
        path: "/api/preparations/transactions/smart-contracts/write",
        ...opts,
      });
    },
    readFromSmartContract(opts = {}) {
      return this._makeRequest({
        method: "POST",
        baseUrl: this._getBaseUrl(),
        path: "/api/smart-contracts/read",
        ...opts,
      });
    },
    signTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        baseUrl: this._getBaseUrl(),
        path: "/api/transaction-signing-sandbox",
        ...opts,
      });
    },
    executeSignedTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        baseUrl: this._getBaseUrl(),
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
