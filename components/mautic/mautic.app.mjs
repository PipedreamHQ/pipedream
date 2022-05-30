import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mautic",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `${this.$auth.mautic_url}/api`;
    },
    _baseHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      method = "GET",
      path,
      params,
      data,
    }) {
      const url = `${this._baseUrl()}${path}`;
      const headers = this._baseHeaders();
      return axios($, {
        url,
        method,
        headers,
        params,
        data,
      });
    },
  },
};
