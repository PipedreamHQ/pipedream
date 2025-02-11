import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "streamlabs",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://streamlabs.com/api/v1.0";
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _makeRequest({
      $ = this,
      path,
      data,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        data: {
          access_token: this._accessToken(),
          ...data,
        },
      });
    },
    sendAlert(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/alerts",
        ...opts,
      });
    },
    createDonation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/donations",
        ...opts,
      });
    },
    sendTestAlert(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/alerts/send_test_alert",
        ...opts,
      });
    },
  },
};
