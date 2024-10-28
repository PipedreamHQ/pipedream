import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ai_textraction",
  methods: {
    _baseUrl() {
      return "https://ai-textraction.p.rapidapi.com";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-rapidapi-host": "ai-textraction.p.rapidapi.com",
          "x-rapidapi-key": `${this.$auth.rapid_key}`,
        },
        ...opts,
      });
    },
    extractData(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/textraction",
        ...opts,
      });
    },
  },
};
