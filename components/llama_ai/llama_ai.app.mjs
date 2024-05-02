import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "llama_ai",
  methods: {
    getUrl(path) {
      return `https://api.llama-api.com${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
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
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
