import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wonderchat",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.wonderchat.io/api/v1";
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        data: {
          ...data,
          apiKey: this.$auth.api_key,
        },
        ...opts,
      });
    },
    chat(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat",
        ...opts,
      });
    },
  },
};
