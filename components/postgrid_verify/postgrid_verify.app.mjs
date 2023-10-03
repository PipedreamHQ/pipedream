import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "postgrid_verify",
  propDefinitions: {
    address: {
      type: "string",
      label: "Address",
      description: "The address you want to parse on a single line.",
    },
  },
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://api.postgrid.com/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "x-api-key": this._getApiKey(),
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async verifyAddress(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/addver/verifications",
        data,
      });
    },
    async parseAddress(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/addver/parses",
        data,
      });
    },
  },
};
