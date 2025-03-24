import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kindo",
  methods: {
    getUrl(path) {
      return `https://llm.kindo.ai/v1${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "content-type": "application/json",
        "api-key": this.$auth.api_key,
      };
    },
    makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
