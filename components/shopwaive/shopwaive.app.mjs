import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shopwaive",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier of the customer",
    },
    balanceIncrement: {
      type: "integer",
      label: "Balance Increment",
      description: "The value to increment the customer's balance by",
    },
    newBalance: {
      type: "integer",
      label: "New Balance",
      description: "The new balance to set for the customer",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.shopwaive.com/api/customer";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Shopwaive-Access-Token": this.$auth.api_key,
          "X-Shopwaive-Platform": this.$auth.platform,
          "Content-Type": "application/json",
        },
        data,
        params,
      });
    },
    async fetchCustomerBalance({ customerId }) {
      return this._makeRequest({
        method: "GET",
        path: `/${customerId}`,
      });
    },
    async increaseCustomerBalance({
      customerId, balanceIncrement,
    }) {
      return this._makeRequest({
        method: "PUT",
        data: {
          customer_id: customerId,
          amount: balanceIncrement,
          note: "Balance increment via API",
        },
      });
    },
    async updateCustomerBalance({
      customerId, newBalance,
    }) {
      return this._makeRequest({
        method: "POST",
        data: {
          customer_id: customerId,
          balance: newBalance,
          note: "Balance update via API",
        },
      });
    },
  },
};
