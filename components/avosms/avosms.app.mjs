import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "avosms",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.avosms.com/v1";
    },
    getAuthData(data) {
      const {
        id,
        key,
      } = this.$auth;
      return {
        Id: id,
        Key: key,
        ...data,
      };
    },
    async _makeRequest({
      $ = this, path, data, ...args
    }) {
      return axios($, {
        method: "POST",
        url: `${this._baseUrl()}${path}`,
        data: this.getAuthData(data),
        ...args,
      });
    },
    listCountries(opts = {}) {
      return this._makeRequest({
        path: "/list/country",
        ...opts,
      });
    },
    sendSms(opts = {}) {
      return this._makeRequest({
        path: "/sms/send",
        ...opts,
      });
    },
    getBalance(opts = {}) {
      return this._makeRequest({
        path: "/account/balance",
        ...opts,
      });
    },
  },
};
