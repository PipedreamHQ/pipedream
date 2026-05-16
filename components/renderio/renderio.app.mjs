import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "renderio",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://renderio.dev/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-KEY": this.$auth.api_key,
          ...headers,
        },
        ...otherOpts,
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
    runChainedFfmpegCommands(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/run-chained-ffmpeg-commands",
        ...opts,
      });
    },
    runMultipleFfmpegCommands(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/run-multiple-ffmpeg-commands",
        ...opts,
      });
    },
    listFiles(opts = {}) {
      return this._makeRequest({
        path: "/files",
        ...opts,
      });
    },
    getFile({
      fileId, ...opts
    }) {
      return this._makeRequest({
        path: `/files/${fileId}`,
        ...opts,
      });
    },
    storeFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/files/store-file",
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/files/upload",
        ...opts,
      });
    },
    deleteFile({
      fileId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/files/${fileId}`,
        ...opts,
      });
    },
    listPresets(opts = {}) {
      return this._makeRequest({
        path: "/presets",
        ...opts,
      });
    },
    getPreset({
      presetId, ...opts
    }) {
      return this._makeRequest({
        path: `/presets/${presetId}`,
        ...opts,
      });
    },
    executePreset({
      presetId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/presets/${presetId}/execute`,
        ...opts,
      });
    },
  },
};
