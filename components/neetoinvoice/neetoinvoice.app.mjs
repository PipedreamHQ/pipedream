import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "neetoinvoice",
  propDefinitions: {},
  methods: {
    _baseUrl(version = "api/v1/") {
      return `https://${this.$auth.organization_name}.neetoinvoice.com/${version}neeto_integrations/zapier`;
    },
    _headers() {
      return {
        Authorization: `Basic ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, version, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(version) + path,
        headers: this._headers(),
        ...opts,
      });
    },
    async createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriptions",
        version: "/",
        ...opts,
      });
    },
    async deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/subscriptions/${hookId}`,
        version: "/",
      });
    },
    async listClients(opts = {}) {
      return this._makeRequest({
        path: "/clients",
        ...opts,
      });
    },
    async listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
  },
};
