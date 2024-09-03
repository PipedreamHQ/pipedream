import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "storeganise",
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.storeganise.com/api/v1/admin`;
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
          Authorization: `ApiKey ${this.$auth.api_key}`,
        },
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoices",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listUnitRentals(opts = {}) {
      return this._makeRequest({
        path: "/unit-rentals",
        ...opts,
      });
    },
  },
};
