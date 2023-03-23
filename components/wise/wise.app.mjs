import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wise",
  propDefinitions: {
    transferId: {
      label: "Transfer ID",
      description: "The transfer ID",
      type: "string",
      async options({ page }) {
        const transfers = await this.getTransfers({
          offset: page * 100,
          limit: 10,
        });

        return transfers.map((transfer) => ({
          label: `${transfer.sourceValue} ${transfer.sourceCurrency} to ${transfer.targetValue} ${transfer.targetCurrency}`,
          value: transfer.id,
        }));
      },
    },
    currency: {
      label: "Currency",
      description: "Select the currency",
      type: "string",
      async options({ sourceCurrency }) {
        const { sourceCurrencies: currencies } = await this.getCurrencies();

        const _currencies = sourceCurrency
          ? currencies.filter((c) => c.currencyCode === sourceCurrency)[0].targetCurrencies
          : currencies;

        return _currencies.map((currency) => currency.currencyCode);
      },
    },
    profileId: {
      label: "Profile ID",
      description: "The profile ID",
      type: "string",
      async options() {
        const profiles = await this.getProfiles();

        return profiles.map((profile) => ({
          label: profile.type == "personal"
            ? `${profile.details.firstName} ${profile.details.lastName}`
            : `${profile.details.name}`,
          value: profile.id,
        }));
      },
    },
    accountId: {
      label: "Account ID",
      description: "The account ID",
      type: "string",
      async options() {
        const accounts = await this.getAccounts();

        return accounts.map((account) => ({
          label: `${account.accountHolderName} - ${account.currency}`,
          value: account.id,
        }));
      },
    },
    balanceId: {
      label: "Balance ID",
      description: "The balance ID",
      type: "string",
      async options({ profileId }) {
        const balances = await this.getBalances({
          profileId,
          params: {
            types: "STANDARD",
          },
        });

        return balances.map((balance) => ({
          label: balance.currency,
          value: balance.id,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.wise.com/";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiToken()}`,
        },
        ...args,
      });
    },
    async createWebhook({
      profileId, ...args
    }) {
      return this._makeRequest({
        path: `/v3/profiles/${profileId}/subscriptions`,
        method: "post",
        ...args,
      });
    },
    async removeWebhook({
      profileId, webhookId, ...args
    }) {
      return this._makeRequest({
        path: `/v3/profiles/${profileId}/subscriptions/${webhookId}`,
        method: "delete",
        ...args,
      });
    },
    async getProfiles(args = {}) {
      return this._makeRequest({
        path: "/v1/profiles",
        ...args,
      });
    },
    async getAccounts(args = {}) {
      return this._makeRequest({
        path: "/v1/accounts",
        ...args,
      });
    },
    async getBalances({
      profileId, ...args
    }) {
      return this._makeRequest({
        path: `/v4/profiles/${profileId}/balances`,
        ...args,
      });
    },
    async getBalance({
      profileId, balanceId, ...args
    }) {
      return this._makeRequest({
        path: `/v4/profiles/${profileId}/balances/${balanceId}`,
        ...args,
      });
    },
    async getCurrencies(args = {}) {
      return this._makeRequest({
        path: "/v1/currency-pairs",
        ...args,
      });
    },
    async getExchangeRate(args = {}) {
      return this._makeRequest({
        path: "/v1/rates",
        ...args,
      });
    },
    async getTransfer({
      transferId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/transfers/${transferId}`,
        ...args,
      });
    },
    async getTransfers(args = {}) {
      return this._makeRequest({
        path: "/v1/transfers",
        ...args,
      });
    },
    async createTransfer({ ...args }) {
      return this._makeRequest({
        path: "/v1/transfers",
        method: "post",
        ...args,
      });
    },
    async fundTransfer({
      profileId, transferId, ...args
    }) {
      return this._makeRequest({
        path: `/v3/profiles/${profileId}/transfers/${transferId}/payments`,
        method: "post",
        ...args,
      });
    },
    async createQuote({
      profileId, ...args
    }) {
      return this._makeRequest({
        path: `/v3/profiles/${profileId}/quotes`,
        method: "post",
        ...args,
      });
    },
  },
};
