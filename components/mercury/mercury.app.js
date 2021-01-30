const axios = require("axios");

module.exports = {
  type: "app",
  app: "mercury",
  methods: {
    _getBaseURL() {
      return "https://backend.mercury.com/api/v1";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeGetRequest(endpoint, params = null) {
      const config = {
        method: "GET",
        url: `${this._getBaseURL()}${endpoint}`,
        headers: this._getHeaders(),
        params,
      };
      return (await axios(config)).data;
    },
    dayAgo() {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return dayAgo;
    },
    async getAccounts() {
      return (await this._makeGetRequest("/accounts")).accounts;
    },
    async getTransactions(accountId, params, limit, offset) {
      return await this._makeGetRequest(
        `/account/${accountId}/transactions`,
        params
      );
    },
  },
};