import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smartroutes",
  propDefinitions: {
    customerAccount: {
      type: "string",
      label: "Customer Account Number",
      description: "Account number of a customer",
      async options() {
        const { customers } = await this.listCustomers();
        return customers?.map(({
          account: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Custom fields for the order",
      optional: true,
      async options() {
        const { custom_fields: fields } = await this.listCustomFields();
        return fields?.map(({ name }) => name ) || [];
      },
    },
    capacities: {
      type: "string[]",
      label: "Capacities",
      description: "Capacities for the order",
      optional: true,
      async options() {
        const { capacities } = await this.listCapacities();
        return capacities?.map(({ type }) => type ) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.smartroutes.io/v2";
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
          "x-access-key": `${this.$auth.api_key}`,
        },
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listCustomFields(opts = {}) {
      return this._makeRequest({
        path: "/custom-fields",
        ...opts,
      });
    },
    listCapacities(opts = {}) {
      return this._makeRequest({
        path: "/capacities",
        ...opts,
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        method: "post",
        path: "/orders",
        ...opts,
      });
    },
  },
};
