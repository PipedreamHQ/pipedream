import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sitecreator_io",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.sitecreator.io/v1";
    },
    _headers() {
      return {
        //"Your_Api_Key": this.$auth.api_key,
        Authorization: `Bearer ${this.$auth.api_key}`,
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
    checkAvailability(args = {}) {
      return this._makeRequest({
        path: "/site/checkAvailability",
        method: "POST",
        ...args,
      });
    },
    createSite(args = {}) {
      return this._makeRequest({
        path: "/sites",
        method: "POST",
        ...args,
      });
    },
    getSites(args = {}) {
      return this._makeRequest({
        path: "/sites",
        ...args,
      });
    },
    deleteSite(siteId, args = {}) {
      return this._makeRequest({
        path: `/site/deleteSite/${siteId}`,
        method: "DELETE",
        ...args,
      });
    },
    getLeads(args = {}) {
      return this._makeRequest({
        path: "/getContacts/leads",
        method: "POST",
        ...args,
      });
    },
    getNewsletter(args = {}) {
      return this._makeRequest({
        path: "/getContacts/newsletter",
        method: "POST",
        ...args,
      });
    },
  },
};
