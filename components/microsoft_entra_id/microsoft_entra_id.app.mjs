import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_entra_id",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ConsistencyLevel: "eventual",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
  },
};
