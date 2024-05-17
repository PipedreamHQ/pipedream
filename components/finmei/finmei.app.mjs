import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "finmei",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.finmei.com/api";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createInvoice(args) {
      return this._makeRequest({
        method: "POST",
        url: "/invoices",
        ...args,
      });
    },
  },
};
