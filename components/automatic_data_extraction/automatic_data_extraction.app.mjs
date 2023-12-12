import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "automatic_data_extraction",
  methods: {
    _apiUrl() {
      return "https://autoextract.scrapinghub.com/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    _getAuth() {
      return {
        username: `${this.$auth.api_key}`,
        password: "",
      };
    },
    async _makeRequest({
      $ = this, path, data, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(data),
        auth: this._getAuth(),
        data,
        ...opts,
      };
      return axios($, config);
    },
    extractData(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "extract",
        ...args,
      });
    },
  },
};
