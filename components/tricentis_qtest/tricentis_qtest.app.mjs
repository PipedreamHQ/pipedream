import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tricentis_qtest",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `${this.$auth.qtest_base_uri}/api/v3`;
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
  },
};
