import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mocean_api",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://rest.moceanapi.com/rest/2";
    },
    _authParams(params) {
      return {
        ...params,
        "mocean-api-key": `${this.$auth.api_key}`,
        "mocean-api-secret": `${this.$auth.api_secret}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params = {},
      data,
      ...args
    }) {
      if (data) {
        args = {
          ...args,
          data: this._authParams(data),
        };
      } else {
        args = {
          ...args,
          params: this._authParams(params),
        };
      }
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...args,
      });
    },
    getBalance(args = {}) {
      return this._makeRequest({
        path: "/account/balance",
        ...args,
      });
    },
    sendSMS(args = {}) {
      return this._makeRequest({
        path: "/sms",
        method: "POST",
        ...args,
      });
    },
  },
};
