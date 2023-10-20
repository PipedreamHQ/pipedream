import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "exact",
  methods: {
    _baseUrl() {
      return `https://start.exactonline.${this.$auth.region}/api/v1`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    getDivision(args = {}) {
      return this._makeRequest({
        path: "/current/Me",
        ...args,
      });
    },
    async listAccounts(division, args = {}) {
      return this._makeRequest({
        path: `/${division}/crm/Accounts`,
        ...args,
      });
    },
    async listContacts(division, args = {}) {
      return this._makeRequest({
        path: `/${division}/crm/Contacts`,
        ...args,
      });
    },
  },
};
