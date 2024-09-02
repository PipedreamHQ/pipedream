import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "page_x",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Unique customer ID if exists",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the lead",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the lead",
      optional: true,
    },
    more: {
      type: "string[]",
      label: "More",
      description: "Additional details about the lead",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.pagexcrm.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/leads",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createLead(opts = {}) {
      const {
        customerId,
        email,
        phone,
        name,
        more,
        ...otherOpts
      } = opts;

      const data = {
        customer_id: customerId,
        email,
        phone,
        name,
        more: more
          ? more.map(JSON.parse)
          : undefined,
      };

      return this._makeRequest({
        path: "/leads",
        data,
        ...otherOpts,
      });
    },
  },
};
