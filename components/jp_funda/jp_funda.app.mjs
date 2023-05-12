import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jp_funda",
  methods: {
    _apiUrl() {
      return "https://www.jp-funda.com/api/jp";
    },
    _getHeaders() {
      return {
        "Authorization": `Token ${this.$auth.api_key}`,
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
    searchListings({
      path, ...args
    }) {
      return this._makeRequest({
        path,
        ...args,
      });
    },
    getDataBySecurityCode({
      securityCode, ...args
    }) {
      return this._makeRequest({
        path: `securities_code/list/${securityCode}`,
        ...args,
      });
    },
    getDataByEdinetCode({
      edinetCode, ...args
    }) {
      return this._makeRequest({
        path: `edinet_code/list/${edinetCode}`,
        ...args,
      });
    },
  },
};
