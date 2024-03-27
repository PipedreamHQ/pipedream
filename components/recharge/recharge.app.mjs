import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "recharge",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer.",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email address of the customer.",
      optional: true,
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The unique identifier for the order.",
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The unique identifier for the product.",
      optional: true,
    },
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description: "The unique identifier for the subscription.",
    },
    addressId: {
      type: "string",
      label: "Address ID",
      description: "Select an address or provide a custom address ID.",
      async options({ page }) {
        const items = await this.listAddresses({
          params: {
            page,
          },
        });
        return items?.map?.((item) => ({
          label: [
            item.address1,
            item.address2,
          ].filter((i) => i).join(),
          value: item.id,
        }));
      },
    },
    discountId: {
      type: "string",
      label: "Discount ID",
      description: "The unique identifier for the discount.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rechargeapps.com";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "X-Recharge-Access-Token": this.$auth.api_key,
        },
      });
    },
    async listAddresses(args) {
      return this._makeRequest({
        url: "/addresses",
        ...args,
      });
    },
    async createSubscription({
      customerId, productId, addressId, discountId,
    }) {
      return this._makeRequest({
        method: "POST",
        url: "/subscriptions",
        data: {
          customer_id: customerId,
          product_id: productId,
          address_id: addressId,
          discount_id: discountId,
        },
      });
    },
    async cancelSubscription({ subscriptionId }) {
      return this._makeRequest({
        method: "POST",
        url: `/subscriptions/${subscriptionId}/cancel`,
      });
    },
    async updateCustomer({
      customerId, name, email, addressId,
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/customers/${customerId}`,
        data: {
          name,
          email,
          address_id: addressId,
        },
      });
    },
  },
};
