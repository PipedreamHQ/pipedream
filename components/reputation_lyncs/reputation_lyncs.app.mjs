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
      return "https://reputationlync.com/app/api";
    },
    async _makeRequest({
      $ = this,
      path,
      data,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        data: {
          ...data,
          "Apikey": `${this.$auth.api_key}`,
        },
      });
    },
    async addCustomer(args) {
      return this._makeRequest({
        method: "POST",
        path: "/customer/addCustomer",
        ...args,
      });
    },
    async listCustomers(args) {
      return this._makeRequest({
        method: "POST",
        path: "/customer/listCustomer",
        ...args,
      });
    },
  },
};
