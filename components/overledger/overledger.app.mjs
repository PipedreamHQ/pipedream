import { axios } from "@pipedream/platform";
import { OVERLEDGER_INSTANCE } from "./common/constants.mjs";

export default {
  type: "app",
  app: "overledger",
  propDefinitions: {
    smartContractId: {
      type: "string",
      label: "Smart Contract ID",
      description: "The ID of the smart contract to interact with.",
    },
    environment: {
      type: "string",
      label: "Overledger Instance",
      description: "Select the Overledger instance to be used",
      options: OVERLEDGER_INSTANCE,
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
    _getBaseUrl(environment) { //conditional for environment url selection.
      return environment === "sandbox"
        ? "https://api.sandbox.overledger.dev"
        : "https://api.overledger.dev";
    },
    _makeRequest({
      $ = this, environment, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._getBaseUrl(environment) + path,
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
    readFromSmartContract(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/smart-contracts/read",
        ...opts,
      });
    },
    signTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/transaction-signing-sandbox",
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
      path, webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/api/webhooks/${path}/${webhookId}`,
        ...opts,
      });
    },
  },
};
