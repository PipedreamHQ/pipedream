import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stealthgpt",
  propDefinitions: {
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt to be used as the basis for content generation, or the content to be rephrased.",
    },
  },
  methods: {
    getUrl(path) {
      return `https://stealthgpt.ai/api${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "api-token": this.$auth.api_key,
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
