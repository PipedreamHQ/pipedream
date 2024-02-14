import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reputation_lyncs",
  propDefinitions: {
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer. You must provide at least one of **Email** or **Phone Number**.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the customer. You must provide at least one of **Email** or **Phone Number**.",
      optional: true,
    },
    whatsappEnabled: {
      type: "boolean",
      label: "WhatsApp Enabled",
      description: "Indicate if the Phone Number provided is a WhatsApp enabled number",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Comma separated list of tags to help identify customers (example: retail, online, etc.)",
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
