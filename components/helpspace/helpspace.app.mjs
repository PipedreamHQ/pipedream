import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "helpspace",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
      async options({ page }) {
        const { data } = await this.listCustomers({
          params: {
            page,
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
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email address of the customer",
      async options({ page }) {
        const { data } = await this.listCustomers({
          params: {
            page,
          },
        });
        return data?.map(({
          email: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title of the customer",
      optional: true,
    },
    address: {
      type: "string",
      label: "Street Address",
      description: "Street address of the customer",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the customer",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the customer",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal Code of the customer",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the customer",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.helpspace.com/api/v1";
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
          "Authorization": `Bearer ${this.$auth.access_token}`,
          "Hs-Client-Id": `${this.$auth.client_id}`,
        },
      });
    },
    updateWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    createTicket(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tickets",
        ...opts,
      });
    },
    updateCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
  },
};
