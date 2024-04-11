import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "recharge",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Select a customer or provide a custom customer ID.",
      async options({ page = 0 }) {
        const { customers } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });
        return customers?.map?.(({
          email, id,
        }) => ({
          label: email,
          value: id,
        }));
      },
    },
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description: "Select a subscription or provide a custom subscription ID.",
      async options({ page = 0 }) {
        const { subscriptions } = await this.listSubscriptions({
          params: {
            page: page + 1,
          },
        });
        return subscriptions?.map?.(({
          id, sku,
        }) => ({
          label: sku
            ? `SKU ${sku}`
            : `ID ${id}`,
          value: id,
        }));
      },
    },
    addressId: {
      type: "string",
      label: "Address ID",
      description: "Select an address or provide a custom address ID.",
      async options({ page = 0 }) {
        const { addresses } = await this.listAddresses({
          params: {
            page: page + 1,
          },
        });
        return addresses?.map?.((item) => ({
          label: [
            item.address1,
            item.address2,
          ].filter((i) => i).join(),
          value: item.id,
        }));
      },
    },
    externalVariantId: {
      type: "string",
      label: "External Variant ID",
      description: "The variant id as it appears in the external e-commerce platform.",
      async options({ page = 0 }) {
        const { products } = await this.listProducts({
          params: {
            page: page + 1,
          },
        });
        return products?.flatMap(({ variants }) => variants?.map((item) => ({
          label: item.title ?? item.sku,
          value: item.external_variant_id,
        }))).filter((i) => i) ?? [];
      },
    },
    discountId: {
      type: "string",
      label: "Discount ID",
      description: "The unique identifier for the discount.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Customer's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Customer's last name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Customer's phone number. Must be in E.164 format, such as `+16175551212`",
      optional: true,
    },
    externalCustomerId: {
      type: "string",
      label: "External Customer ID",
      description: "The customer ID as it appears in the external e-commerce platform.",
      optional: true,
    },
    taxExempt: {
      type: "boolean",
      label: "Tax Exempt",
      description: "Whether or not the customer is tax exempt.",
      optional: true,
    },
    applyCreditToNextRecurringCharge: {
      type: "boolean",
      label: "Apply Credit to Next Recurring Charge",
      description: "A boolean that indicates whether Recharge credits will be applied to the next recurring charge.",
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
    async listCustomers(args) {
      return this._makeRequest({
        url: "/customers",
        ...args,
      });
    },
    async listProducts(args) {
      return this._makeRequest({
        url: "/products",
        ...args,
      });
    },
    async listSubscriptions(args) {
      return this._makeRequest({
        url: "/subscriptions",
        ...args,
      });
    },
    async createSubscription(args) {
      return this._makeRequest({
        method: "POST",
        url: "/subscriptions",
        ...args,
      });
    },
    async cancelSubscription({
      subscriptionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/subscriptions/${subscriptionId}/cancel`,
        ...args,
      });
    },
    async createCustomer(args) {
      return this._makeRequest({
        method: "POST",
        url: "/customers",
        ...args,
      });
    },
    async updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/customers/${customerId}`,
        ...args,
      });
    },
    async createWebhook(args) {
      return this._makeRequest({
        method: "POST",
        url: "/webhooks",
        ...args,
      });
    },
    async deleteWebhook(id) {
      return this._makeRequest({
        method: "DELETE",
        url: `/webhooks/${id}`,
      });
    },
  },
};
