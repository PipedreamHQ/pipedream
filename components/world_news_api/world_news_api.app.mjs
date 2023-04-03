import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "world_news_api",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.worldnewsapi.com";
    },
    _getApiKey() {
      console.log(this.$auth);
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        // "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        params: {
          ...opts.params,
          "api-key": this._getApiKey(),
        },
      };
      return axios(ctx, axiosOpts);
    },
    async searchNews(params, ctx = this) {
      return this._makeHttpRequest({
        path: "/search-news",
        method: "GET",
        params,
      }, ctx);
    },
  },
};
