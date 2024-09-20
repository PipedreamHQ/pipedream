import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fileforge",
  methods: {
    _baseUrl() {
      return "https://api.fileforge.com";
    },
    _headers(headers = {}) {
      return {
        "X-API-Key": this.$auth.api_key,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    generatePDF(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pdf/generate/",
        ...opts,
      });
    },
  },
};
