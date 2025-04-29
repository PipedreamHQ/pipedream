import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jina_reader",
  methods: {
    getUrl() {
      return "https://r.jina.ai/";
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
