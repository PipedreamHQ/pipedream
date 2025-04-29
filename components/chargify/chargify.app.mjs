import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chargify",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
      async options({ page }) {
        const customers = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });
        return customers?.map(({ customer }) => ({
          value: customer.id,
          label: `${customer.first_name} ${customer.last_name}`,
        })) || [];
      },
    },
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description: "The ID of the subscription",
      async options({ page }) {
        const subscriptions = await this.listSubscriptions({
          params: {
            page: page + 1,
          },
        });
        return subscriptions?.map(({ subscription }) => ({
          value: subscription.id,
          label: `${subscription.customer.first_name} ${subscription.customer.last_name} - ${subscription.product.name}`,
        })) || [];
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
      async options({ page }) {
        const products = await this.listProducts({
          params: {
            page: page + 1,
          },
        });
        return products?.map(({ product }) => ({
          value: product.id,
          label: product.name,
        })) || [];
      },
    },
    couponCode: {
      type: "string",
      label: "Coupon Code",
      description: "The coupon code",
      optional: true,
      async options({ page }) {
        const coupons = await this.listCoupons({
          params: {
            page: page + 1,
          },
        });
        return coupons?.map(({ coupon }) => ({
          value: coupon.code,
          label: coupon.name,
        })) || [];
      },
    },
    paymentCollectionMethod: {
      type: "string",
      label: "Payment Collection Method",
      description: "The type of payment collection to be used in the subscription",
      optional: true,
      options: [
        "automatic",
        "remittance",
        "prepaid",
      ],
    },
    nextBillingAt: {
      type: "string",
      label: "Next Billing At",
      description: "The next billing date in ISO-8601 format. Example: `2024-10-31T00:00:00Z`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.chargify.com`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json",
        },
        auth: {
          username: `${this.$auth.api_key}`,
          password: "",
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/endpoints.json",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/endpoints/${hookId}.json`,
        ...opts,
      });
    },
    enableWebhooks(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/webhooks/settings.json",
        data: {
          webhooks_enabled: true,
        },
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers.json",
        ...opts,
      });
    },
    listSubscriptions(opts = {}) {
      return this._makeRequest({
        path: "/subscriptions.json",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products.json",
        ...opts,
      });
    },
    listCoupons(opts = {}) {
      return this._makeRequest({
        path: "/coupons.json",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers.json",
        ...opts,
      });
    },
    createSubscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriptions.json",
        ...opts,
      });
    },
    updateSubscription({
      subscriptionId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/subscriptions/${subscriptionId}.json`,
        ...opts,
      });
    },
  },
};
