import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "arxiv",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://export.arxiv.org/api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...opts,
      });
    },
    search(opts = {}) {
      return this._makeRequest({
        path: "/query",
        ...opts,
      });
    },
  },
};
