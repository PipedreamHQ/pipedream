import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "convolo_ai",
  methods: {
    _baseUrl() {
      return "https://app.convolo.ai/rest/v1/ext";
    },
    _authData() {
      return {
        widget_key: `${this.$auth.widget_key}`,
        api_key: `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        data: {
          ...data,
          ...this._authData(),
        },
        ...opts,
      });
    },
    async createCall(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/add_call_api", // Placeholder path, replace with actual API endpoint
        ...opts,
      });
    },
  },
};
