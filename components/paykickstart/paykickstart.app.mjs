import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paykickstart",
  propDefinitions: {
    campaignId: {
      type: "integer",
      label: "Campaign ID",
      description: "The campaign ID",
    },
    productId: {
      type: "integer",
      label: "Product ID",
      description: "The campaign ID for the product",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The unique purchase/subscription invoice ID",
      async options() {
        const { transactions } = await this.getTransactions();

        return transactions
          .filter((transaction) => transaction.invoice_id)
          .map((transaction) => ({
            label: `${transaction.invoice_id} - ${transaction.buyer_email || transaction.buyer_name || "No name"} - $${transaction.total_amount || 0}`,
            value: transaction.invoice_id,
          }));
      },
    },
    affiliateId: {
      type: "string",
      label: "Affiliate ID",
      description: "The affiliate ID or email",
      async options({ campaignId }) {
        if (!campaignId) {
          return [];
        }

        const affiliates = await this.getAffiliates({
          campaignId,
        });

        return affiliates.map((affiliate) => ({
          label: `${affiliate.name || affiliate.email} - ${affiliate.email}`,
          value: affiliate.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.paykickstart.com/api";
    },
    async _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      const response = await axios($, {
        ...otherOpts,
        debug: true,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          auth_token: this.$auth.api_key,
          ...otherOpts?.data,
        },
      });
      if (response.error) {
        throw new Error(JSON.stringify(response.error, null, 2));
      }
      return response;
    },
    createPurchase(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/purchase",
        ...opts,
      });
    },
    cancelSubscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriptions/cancel",
        ...opts,
      });
    },
    getTransactions(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transactions",
        ...opts,
      });
    },
    getAffiliates({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/affiliates/all",
        data: {
          campaign_id: campaignId,
        },
        ...opts,
      });
    },
  },
};
