const axios = require("axios");

module.exports = {
  type: "app",
  app: "mercury",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account",
      async options() {
        const results = await this.getAccounts();
        const options = results.map((result) => {
          const {
            name, id,
          } = result;
          return {
            label: name,
            value: id,
          };
        });
        return options;
      },
    },
  },
  methods: {
    _getBaseURL() {
      return "https://backend.mercury.com/api/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest(method, endpoint, params = null) {
      const config = {
        method,
        url: `${this._getBaseURL()}${endpoint}`,
        headers: this._getHeaders(),
        params,
      };
      return (await axios(config)).data;
    },
    daysAgo(days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return daysAgo;
    },
    async getAccounts() {
      return (await this._makeRequest("GET", "/accounts")).accounts;
    },
    async getTransactions(accountId, params) {
      return await this._makeRequest(
        "GET",
        `/account/${accountId}/transactions`,
        params,
      );
    },
  },
};
