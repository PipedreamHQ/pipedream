import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "proabono",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier of the customer",
    },
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "The information about the customer",
      optional: true,
    },
    subscriptionDetails: {
      type: "object",
      label: "Subscription Details",
      description: "The information about the subscription",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-2.proabono.com";
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
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createOrUpdateCustomer({
      customerId, customerDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/Customer",
        data: {
          ReferenceCustomer: customerId,
          ...customerDetails,
        },
      });
    },
    async getCustomer({ customerId }) {
      return this._makeRequest({
        path: `/v1/Customer?ReferenceCustomer=${customerId}`,
      });
    },
    async initializeSubscription({
      customerId, subscriptionDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/Subscription",
        data: {
          ReferenceCustomer: customerId,
          ...subscriptionDetails,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
