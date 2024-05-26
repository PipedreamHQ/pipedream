import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "platerecognizer",
  methods: {
    _baseUrl() {
      return "https://api.platerecognizer.com/v1";
    },
    _headers(headers) {
      return {
        "Authorization": `Token ${this.$auth.api_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    runRecognition(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/plate-reader/",
        ...opts,
      });
    },
  },
};
