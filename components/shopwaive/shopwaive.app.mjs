import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shopwaive",
  propDefinitions: {
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email address of the customer",
    },
    amount: {
      type: "integer",
      label: "Increment Amount",
      description: "Value to increment (add or subtract) to the customer's available balance",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Description of the transaction",
    },
    newBalance: {
      type: "integer",
      label: "New Balance",
      description: "The new balance to set for the customer",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.shopwaive.com/api";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...args
    }) {
      return axios($, {
        ...args,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "X-Shopwaive-Access-Token": this.$auth.access_token,
          "X-Shopwaive-Platform": this.$auth.platform,
          "Content-Type": "application/json",
        },
      });
    },
    async fetchCustomerBalance({
      customerEmail, ...args
    }) {
      return this._makeRequest({
        method: "GET",
        url: `customer/${customerEmail}`,
        ...args,
      });
    },
    async increaseCustomerBalance(args) {
      return this._makeRequest({
        method: "PUT",
        url: "/customer",
        ...args,
      });
    },
    async updateCustomerBalance(args) {
      return this._makeRequest({
        method: "POST",
        url: "/customer",
        ...args,
      });
    },
  },
};
