import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "payhip",
  propDefinitions: {
    productLink: {
      type: "string",
      label: "Product Link",
      description: "The product link",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://payhip.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "payhip-api-key": this._apiKey(),
        },
      });
    },
    async verifyLicenseKey(args = {}) {
      return this._makeRequest({
        path: "/license/verify",
        ...args,
      });
    },
    async enableLicenseKey(args = {}) {
      return this._makeRequest({
        path: "/license/enable",
        method: "put",
        ...args,
      });
    },
    async disableLicenseKey(args = {}) {
      return this._makeRequest({
        path: "/license/disable",
        method: "put",
        ...args,
      });
    },
  },
};
