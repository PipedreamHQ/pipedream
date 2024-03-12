import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "splynx",
  version: "0.0.1",
  propDefinitions: {
    customerId: {
      type: "integer",
      label: "Customer ID",
      description: "Select a customer to update, or provide a customer ID.",
      async options() {
        const customers = await this.listCustomers();
        return customers?.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.splynx.$auth.subdomain}.splynx.app/api/2.0/admin`;
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "Authorization": `Splynx-EA (access_token=${this.$auth.oauth_access_token})`,
        },
      });
    },
    async listCustomers() {
      return this._makeRequest({
        url: "/customers/customer",
      });
    },
    async createCustomer(args) {
      return this._makeRequest({
        method: "POST",
        url: "/customers/customer",
        ...args,
      });
    },
    async createInternetService({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/customers/customer/${customerId}/internet-services`,
        ...args,
      });
    },
    async updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/customers/customer/${customerId}`,
        ...args,
      });
    },
  },
};
