import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ikas",
  methods: {
    _baseUrl() {
      return "https://api.myikas.com/api/v1/admin/graphql";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    makeRequest({
      $ = this, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl(),
        headers: this._headers(),
        ...opts,
      });
    },
  },
};
