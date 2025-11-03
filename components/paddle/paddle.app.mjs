import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "paddle",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Customer's email address",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Customer's full name",
    },
    customData: {
      type: "object",
      label: "Custom Data",
      description: "Your own structured key-value data",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Customer's status",
      options: constants.STATUS_OPTIONS,
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Unique identifier of the customer",
      async options() {
        const response = await this.getCustomers();
        const data = response.data;
        return data.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.paddle.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.auth_code}`,
          ...headers,
        },
      });
    },

    async getCustomers(args = {}) {
      return this._makeRequest({
        path: "/customers",
        ...args,
      });
    },

    async createCustomer(args = {}) {
      return this._makeRequest({
        path: "/customers",
        method: "post",
        ...args,
      });
    },

    async updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
        method: "patch",
        ...args,
      });
    },
  },
};
