import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "qr_api",
  methods: {
    _baseUrl() {
      return "https://qrapi.io/v2";
    },
    _params(params = {}) {
      return {
        api_key: this.$auth.api_key,
        ...params,
      };
    },
    _makeRequest({
      $ = this, path, params = {}, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...opts,
      });
    },
    createQrcode({
      type, ...opts
    }) {
      return this._makeRequest({
        path: `/qrcode/${type}`,
        ...opts,
      });
    },
  },
};
