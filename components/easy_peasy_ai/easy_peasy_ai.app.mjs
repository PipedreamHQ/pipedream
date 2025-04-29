import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easy_peasy_ai",
  propDefinitions: {
    language: {
      type: "string",
      label: "Language",
      description: "The language of the generated content. Eg. `English`.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://easy-peasy.ai/api${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...headers,
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
