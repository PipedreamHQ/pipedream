import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "boxhero",
  propDefinitions: {
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "The auto-generated ID for the transaction",
    },
    transactionType: {
      type: "string",
      label: "Transaction Type",
      description: "The type of transaction",
      optional: true,
    },
    itemDetails: {
      type: "object",
      label: "Item Details",
      description: "Details about the item involved in the transaction",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://rest.boxhero-app.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getTransaction(transactionId) {
      return this._makeRequest({
        path: `/v1/txs/${transactionId}`,
      });
    },
    async listTransactions() {
      return this._makeRequest({
        path: "/v1/txs",
      });
    },
    async createTransaction(data) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/txs",
        data,
      });
    },
    async updateTransaction(transactionId, data) {
      return this._makeRequest({
        method: "PUT",
        path: `/v1/txs/${transactionId}`,
        data,
      });
    },
    async deleteTransaction(transactionId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/v1/txs/${transactionId}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
