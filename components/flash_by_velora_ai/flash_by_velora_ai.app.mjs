import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flash_by_velora_ai",
  methods: {
    getUrl(path) {
      return `https://flash-api.velora.ai/v1/api${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-api-key": this.$auth.api_key,
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
        method: "POST",
        ...args,
      });
    },
  },
};
