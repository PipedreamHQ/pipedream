import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rendi",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.rendi.dev/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    listFiles(opts = {}) {
      return this._makeRequest({
        path: "/files",
        ...opts,
      });
    },
    listCommands(opts = {}) {
      return this._makeRequest({
        path: "/commands",
        ...opts,
      });
    },
    getFfmpegCommand({
      commandId, ...opts
    }) {
      return this._makeRequest({
        path: `/commands/${commandId}`,
        ...opts,
      });
    },
    runFfmpegCommand(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/run-ffmpeg-command",
        ...opts,
      });
    },
  },
};
