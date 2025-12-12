import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "crowdpower",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "ID of the user",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount of the charge",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the customer",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Custom attributes",
    },
    action: {
      type: "string",
      label: "Action",
      description: "Action related to the event",
    },
  },
  methods: {
    _baseUrl() {
      return "https://beacon.crowdpower.io/";
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
          "Authorization": `Bearer ${this.$auth.application_key}`,
          ...headers,
        },
      });
    },
    async createCustomerCharge(args = {}) {
      return this._makeRequest({
        path: "/charges",
        method: "post",
        ...args,
      });
    },
    async upsertCustomer(args = {}) {
      return this._makeRequest({
        path: "/customers",
        method: "post",
        ...args,
      });
    },
    async createCustomerEvent(args = {}) {
      return this._makeRequest({
        path: "/events",
        method: "post",
        ...args,
      });
    },
  },
};
