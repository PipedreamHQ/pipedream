import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lettria",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.lettria.com";
    },
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `LettriaProKey ${this._getApiKey()}`,
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
    async classifyText(text, ctx = this) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/nls/classification",
        data: {
          documents: [
            text,
          ],
        },
      }, ctx);
    },
  },
};
