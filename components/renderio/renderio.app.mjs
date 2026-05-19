import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "renderio",
  propDefinitions: {
    inputFiles: {
      type: "object",
      label: "Input File URLs",
      description: "Dictionary mapping input aliases to publicly accessible file URLs. Keys must start with `in_`. Example: `{ \"in_video\": \"https://example.com/video.mp4\" }`.",
    },
    outputFiles: {
      type: "object",
      label: "Output File Names",
      description: "Dictionary mapping output aliases to desired output file names. Keys must start with `out_`. Example: `{ \"out_video\": \"output.mp4\" }`.",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Optional key-value metadata to attach to the command or preset execution. Example: `{ \"job_id\": \"abc123\" }`.",
      optional: true,
    },
  },
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
