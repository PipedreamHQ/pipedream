import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "overledger",
  propDefinitions: {
    contractToWatch: {
      type: "string",
      label: "Smart Contract ID",
      description: "The ID of the smart contract to watch for new events.",
    },
    accountToWatch: {
      type: "string",
      label: "Account ID",
      description: "The account ID to watch for transactions to/from.",
    },
    location: {
      type: "string",
      label: "Location",
      description: "The blockchain network and technology the transaction will be submitted to.",
    },
    signingAccountId: {
      type: "string",
      label: "Signing Account ID",
      description: "The blockchain account that will sign the transaction.",
    },
    functionName: {
      type: "string",
      label: "Function Name",
      description: "The name of the function to call on the smart contract.",
    },
    smartContractId: {
      type: "string",
      label: "Smart Contract ID",
      description: "The ID of the smart contract to interact with.",
    },
    inputParameters: {
      type: "string[]",
      label: "Input Parameters",
      description: "The input parameters for the smart contract function, in JSON format.",
      optional: true,
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The ID of the request for executing a signed transaction.",
    },
    signedTransaction: {
      type: "string",
      label: "Signed Transaction",
      description: "The signed transaction data.",
      optional: true,
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "The URL to be called back when the event occurs.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sandbox.overledger.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createSmartContractEventWebhook({
      contractToWatch, callbackUrl,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/webhooks/smart-contract-events",
        data: {
          smartContractId: contractToWatch,
          callbackUrl,
        },
      });
    },
    async createAccountTransactionWebhook({
      accountToWatch, callbackUrl,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/webhooks/accounts",
        data: {
          accountId: accountToWatch,
          callbackUrl,
        },
      });
    },
    async prepareSmartContractTransaction({
      location, signingAccountId, functionName, smartContractId, inputParameters,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/preparations/transactions/smart-contracts/write",
        data: {
          location,
          signingAccountId,
          functionName,
          smartContractId,
          inputParameters,
        },
      });
    },
    async executeSignedTransaction({
      requestId, signedTransaction,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/executions/transactions",
        data: {
          requestId,
          signedTransaction,
        },
      });
    },
  },
};
