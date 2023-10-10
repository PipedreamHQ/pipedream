import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "booqable",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
      async options() {
        const customers = await this.listCustomers();
        return customers.map((c) => ({
          label: c.name,
          value: c.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.company_slug}.booqable.com/api/1`;
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listCustomers(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/customers",
      });
    },
    async createCustomer({
      name, email,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: {
          customer: {
            name,
            email,
          },
        },
      });
    },
    async getCustomerDetails({ customerId }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
      });
    },
    async updateCustomerDetails({
      customerId, name, email,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/customers/${customerId}`,
        data: {
          customer: {
            name,
            email,
          },
        },
      });
    },
    async listOrders(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/orders",
      });
    },
  },
};
