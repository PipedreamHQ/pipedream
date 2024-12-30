import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "callerapi",
  version: "0.0.1",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://callerapi.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Auth": this.$auth.api_key,
        },
      });
    },
    async getPhoneInfo(phoneNumber, opts = {}) {
      const phone = phoneNumber.replace(/^\+/, "");
      return this._makeRequest({
        method: "GET",
        path: `/phone/info/${phone}`,
        ...opts,
      });
    },
    async getPhonePicture(phoneNumber, opts = {}) {
      const phone = phoneNumber.replace(/^\+/, "");
      return this._makeRequest({
        method: "GET",
        path: `/phone/pic/${phone}`,
        ...opts,
      });
    },
  },
};
