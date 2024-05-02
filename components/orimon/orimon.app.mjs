import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "orimon",
  methods: {
    _baseUrl() {
      return "https://channel-connector.orimon.ai/orimon/v1";
    },
    _headers() {
      return {
        "Authorization": `apiKey ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/conversation/api/message",
        ...opts,
      });
    },
  },
};
