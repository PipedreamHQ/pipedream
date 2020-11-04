const axios = require("axios");
const parseLinkHeader = require('parse-link-header');

module.exports = {
  type: "app",
  app: "sendgrid",
  methods: {
    _authToken() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.sendgrid.com/v3";
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    async *_getItems(opts) {
      let { url } = opts;
      const requestData = {
        query: opts.query,
      };
      const requestConfig = this._makeRequestConfig();

      do {
        const { data, headers } = await axios.post(url, requestData, requestConfig);

        const { result } = data;
        for (const item of result) {
          yield item;
        }

        const { next } = parseLinkHeader(headers);
        url = next;
      } while (url);
    },
    async _getAllItems(params) {
      const { url, query } = params;
      const requestData = {
        query,
      };
      const requestConfig = this._makeRequestConfig();
      const { data: { result } } = await axios.post(url, requestData, requestConfig);
      return result;
    },
  },
};
