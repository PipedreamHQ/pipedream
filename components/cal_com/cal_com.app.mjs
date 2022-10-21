import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cal_com",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}/v1/`;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        params = {},
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          apiKey: this._apiKey(),
        },
        ...otherArgs,
      };
      return axios($, config);
    },
    async createWebhook(data) {
      return this._makeRequest({
        method: "POST",
        path: "hooks",
        data,
      });
    },
    async deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `hooks/${hookId}`,
      });
    },
    async listBookings() {
      return this._makeRequest({
        method: "GET",
        path: "bookings",
      });
    },
  },
};
