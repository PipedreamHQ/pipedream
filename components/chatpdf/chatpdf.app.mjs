import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatpdf",
  methods: {
    getUrl(path) {
      return `https://api.chatpdf.com/v1${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
