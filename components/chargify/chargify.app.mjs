import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chargify",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
    },
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description: "The ID of the subscription",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
      optional: true,
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "The organization of the customer",
      optional: true,
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
    },
    couponCode: {
      type: "string",
      label: "Coupon Code",
      description: "The coupon code",
      optional: true,
    },
    nextBillingAt: {
      type: "string",
      label: "Next Billing At",
      description: "The next billing date",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chargify.com/api/v2";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    async getSubscriptions(opts = {}) {
      return this._makeRequest({
        path: "/subscriptions",
        ...opts,
      });
    },
    async createSubscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriptions",
        ...opts,
      });
    },
    async updateSubscription({ subscriptionId, ...opts }) {
      return this._makeRequest({
        method: "PUT",
        path: `/subscriptions/${subscriptionId}`,
        ...opts,
      });
    },
  },
};