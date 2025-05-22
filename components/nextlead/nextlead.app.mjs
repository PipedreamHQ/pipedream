import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nextlead",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return this.$auth.api_url;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    searchLeads(opts = {}) {
      return this._makeRequest({
        path: "/receive/contact/find-contact",
        method: "POST",
        ...opts,
      });
    },
    getNewlyCreatedLeads(opts = {}) {
      return this._makeRequest({
        path: "/polling/contact/user-created",
        ...opts,
      });
    },
    getNewlyUpdatedLeads(opts = {}) {
      return this._makeRequest({
        path: "/polling/contact/user-edited",
        ...opts,
      });
    },
    getContactsAddedToList(opts = {}) {
      return this._makeRequest({
        path: "/polling/email/added-to-list",
        ...opts,
      });
    },
  },
};
