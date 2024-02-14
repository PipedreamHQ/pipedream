import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reputation_lyncs",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer.",
      optional: false,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer.",
      optional: true,
    },
    customerPhone: {
      type: "string",
      label: "Customer Phone",
      description: "The phone number of the customer.",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the customer.",
      optional: false,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the customer.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.reputationlyncs.com";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async addCustomer({
      fullName, email, phone,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: {
          fullName,
          email,
          phone,
        },
      });
    },
    async getCustomer({ customerId }) {
      return this._makeRequest({
        method: "GET",
        path: `/customers/${customerId}`,
      });
    },
    async emitNewCustomerEvent({
      customerId, customerName, customerPhone,
    }) {
      console.log("Emitting new customer event:", {
        customerId,
        customerName,
        customerPhone,
      });
    },
  },
};
