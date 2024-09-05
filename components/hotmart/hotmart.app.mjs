import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hotmart",
  propDefinitions: {
    offerCode: {
      type: "string",
      label: "Offer Code",
      description: "Code of the offer",
      optional: true,
    },
    buyerEmail: {
      type: "string",
      label: "Buyer Email",
      description: "Email of the buyer",
      optional: true,
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "ID of the product",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date for the query, in milliseconds",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date for the query, in milliseconds",
      optional: true,
    },
    subscriberCode: {
      type: "string",
      label: "Subscriber Code",
      description: "ID code of the subscriber",
      async options() {
        const response = await this.getSubscriprions({});
        const accountIDs = response.items;
        return accountIDs.map(({
          subscriber_code, subscriber,
        }) => ({
          value: subscriber_code,
          label: subscriber.name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}.hotmart.com/payments/api/v1`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async getSubscriptions(args = {}) {
      return this._makeRequest({
        path: "/subscriptions",
        ...args,
      });
    },
    async getComissions(args = {}) {
      return this._makeRequest({
        path: "/sales/commissions",
        ...args,
      });
    },
    async getSalesHistory(args = {}) {
      return this._makeRequest({
        path: "/sales/history",
        ...args,
      });
    },
  },
};
