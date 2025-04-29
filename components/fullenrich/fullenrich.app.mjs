import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fullenrich",
  methods: {
    getUrl(path) {
      return `https://app.fullenrich.com/api/v1${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
