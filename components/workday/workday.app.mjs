import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "workday",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}/ccx/api/v1/${this.$auth.tenant_id}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
  },
};
