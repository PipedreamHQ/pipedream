import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alerty",
  methods: {
    _baseUrl() {
      return `${this.$auth.notification_url}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
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
