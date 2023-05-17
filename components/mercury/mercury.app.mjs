import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mercury",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account",
      description: "The account unique identification",
      async options() {
        const accounts = await this.getAccounts();
        return accounts.map((account) => ({
          label: account.name,
          value: account.id,
        }));
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
    async _makeRequest({
      endpoint,
      ctx = this,
      method = "GET",
      params = null,
    }) {
      const config = {
        method,
        url: `${this._getBaseURL()}${endpoint}`,
        headers: this._getHeaders(),
        params,
      };
      return (await axios(ctx, config));
    },
    daysAgo(days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return daysAgo;
    },
    async getAccounts() {
      const { accounts } = await this._makeRequest({
        endpoint: "/accounts",
      });
      return accounts;
    },
    getTransactions({
      ctx,
      accountId,
      params,
    }) {
      return this._makeRequest({
        ctx,
        endpoint: `/account/${accountId}/transactions`,
        params,
      });
    },
    getAccountInfo({
      ctx,
      accountId,
    }) {
      return this._makeRequest({
        ctx,
        endpoint: `/account/${accountId}`,
      });
    },
  },
};
