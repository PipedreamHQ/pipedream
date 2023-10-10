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
    customer: {
      type: "string",
      label: "Customer",
      description: "Select the customer to update",
      async options() {
        const customers = await this.listCustomers();
        return customers.map((customer) => ({
          label: customer.name,
          value: customer.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.company_slug}.booqable.com/api/1`;
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "/customers",
        ...args,
      });
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...args,
      });
    },
    getCustomer({
      customerId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
        ...args,
      });
    },
    updateCustomer({
      customerId, ...args
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/customers/${customerId}`,
        ...args,
      });
    },
    listOrders(args = {}) {
      return this._makeRequest({
        path: "/orders",
        ...args,
      });
    },
  },
};
