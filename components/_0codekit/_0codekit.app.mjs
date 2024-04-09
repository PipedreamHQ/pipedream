import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "_0codekit",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://v2.1saas.co";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          auth: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    readQrCode(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/generate/qrcode/decode",
        ...opts,
      });
    },
    async compressPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pdf/compress",
        ...opts,
      });
    },
  },
};
