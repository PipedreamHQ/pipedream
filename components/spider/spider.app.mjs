import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "spider",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.spider.cloud";
    },
    async _makeRequest({
      $ = this, path = "/", headers, ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async initiateCrawl(args) {
      return this._makeRequest({
        method: "POST",
        path: "/crawl",
        ...args,
      });
    },
  },
};
