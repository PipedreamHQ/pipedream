import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flutterwave",
  propDefinitions: {
    bank: {
      type: "string",
      label: "Bank",
      async options() {
        const banks = await this.getBanks();
        return banks.map((b) => ({
          value: b.id,
          label: b.name,
        }));
      },
    },
    currency: {
      type: "string",
      label: "Currency",
      async options() {
        const currencies = [
          "USD",
          "GBP",
          "EUR",
          "JPY",
          "AUD",
          "CAD",
        ];
        return currencies.map((c) => ({
          value: c,
          label: c,
        }));
      },
    },
    payoutSubaccount: {
      type: "string",
      label: "Payout Subaccount",
      async options() {
        const subaccounts = await this.getPayoutSubaccounts();
        return subaccounts.map((s) => ({
          value: s.id,
          label: s.business_name,
        }));
      },
    },
    transaction: {
      type: "string",
      label: "Transaction",
      async options() {
        const transactions = await this.getTransactions();
        return transactions.data.map((t) => ({
          value: t.id,
          label: `${t.tx_ref} - ${t.amount} ${t.currency}`,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flutterwave.com/v3";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getBanks() {
      return this._makeRequest({
        path: "/banks/NG",
      });
    },
    async getPayoutSubaccounts() {
      return this._makeRequest({
        path: "/subaccounts",
      });
    },
    async getTransactions() {
      return this._makeRequest({
        path: "/transactions",
      });
    },
    async initiateTransfer({
      bank, currency, payoutSubaccount,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/transfers",
        data: {
          account_bank: bank,
          account_number: payoutSubaccount,
          currency: currency,
          amount: 1000,
          narration: "cashout",
          beneficiary_name: "John Doe",
        },
      });
    },
    async confirmTransaction({ transaction }) {
      return this._makeRequest({
        method: "GET",
        path: `/transactions/${transaction}/verify`,
      });
    },
  },
};
