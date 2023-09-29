import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "goody",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product",
      description: "Identifier of a product",
      async options({ page }) {
        const { data } = await this.listProducts({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    paymentMethodId: {
      type: "string",
      label: "Payment Method",
      description: "The payment method used to pay for this order batch. If not specified, defaults to the first payment method on the account. If the account has no payment methods, then the order batch creation will fail.",
      optional: true,
      async options() {
        const { data } = await this.listPaymentMethods();
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}.ongoody.com/v1`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.automation_api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listProducts(args = {}) {
      return this._makeRequest({
        path: "/products",
        ...args,
      });
    },
    listPaymentMethods(args = {}) {
      return this._makeRequest({
        path: "/payment_methods",
        ...args,
      });
    },
    createOrder(args = {}) {
      return this._makeRequest({
        path: "/order_batches",
        method: "POST",
        ...args,
      });
    },
  },
};
