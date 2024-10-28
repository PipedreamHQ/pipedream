import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flash_by_velora_ai",
  methods: {
    _baseUrl() {
      return "https://flash-api.velora.ai/v1/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method: "POST",
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    sendFeedback(opts = {}) {
      return this._makeRequest({
        path: "/add-feedback",
        ...opts,
      });
    },
    sendTranscript(opts = {}) {
      return this._makeRequest({
        path: "/upload-transcript",
        ...opts,
      });
    },
  },
};
