import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "firefish",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.firefishsoftware.com/api/v1.0";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    searchContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/search",
        ...opts,
      });
    },
    searchCandidates(opts = {}) {
      return this._makeRequest({
        path: "/candidates/search",
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    updateCandidate({
      candidateId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/candidates/${candidateId}`,
        ...opts,
      });
    },
  },
};
