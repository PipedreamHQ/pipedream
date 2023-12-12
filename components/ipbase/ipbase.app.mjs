import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ipbase",
  propDefinitions: {
    ip: {
      type: "string",
      label: "IP",
      description: "The IP address you want to query.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.ipbase.com/v2";
    },
    _getHeaders() {
      return {
        "apikey": this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    getASNInfo(args = {}) {
      return this._makeRequest({
        path: "asns",
        ...args,
      });
    },
    getIPInfo(args = {}) {
      return this._makeRequest({
        path: "info",
        ...args,
      });
    },
    listDomains(args = {}) {
      return this._makeRequest({
        path: "domains",
        ...args,
      });
    },
  },
};

