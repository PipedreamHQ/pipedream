import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "payment_app",
  propDefinitions: {
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount for the payment request",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency for the payment request",
    },
    expiryDate: {
      type: "string",
      label: "Expiry Date",
      description: "The expiry date for the payment request",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Custom metadata for the payment request",
      optional: true,
    },
    storeWalletId: {
      type: "string",
      label: "Store Wallet ID",
      description: "The ID of the store wallet",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.payment_app.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "get",
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
    async createPaymentRequest({
      amount, currency, expiryDate, metadata,
    }) {
      return this._makeRequest({
        method: "post",
        path: "/payment_requests",
        data: {
          amount,
          currency,
          expiry_date: expiryDate,
          metadata,
        },
      });
    },
    async getStoreWalletBalance({ storeWalletId }) {
      return this._makeRequest({
        path: `/store_wallets/${storeWalletId}/balance`,
      });
    },
  },
};
