import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "robopost",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the video series configuration",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The type of the content of the video",
      options: constants.CONTENT_TYPES,
      optional: true,
    },
    style: {
      type: "string",
      label: "Style",
      description: "The style of the video",
      options: constants.STYLE_OPTIONS,
      optional: true,
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "The voice used for the video",
      options: constants.VOICE_OPTIONS,
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language Code",
      description: "Language of the video, i.e.: `en`",
      optional: true,
    },
    maxDuration: {
      type: "integer",
      label: "Max Duration",
      description: "Maximum video duration in seconds (5-600)",
      optional: true,
    },
    configurationId: {
      type: "string",
      label: "Configuration ID",
      description: "ID of the configuration for the video generation",
      async options() {
        const response = await this.getVideoSeries();
        return response.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "ID of the task to be checked",
      async options() {
        const response = await this.getTaskStatus();
        return response.map(({
          created_at, task_id,
        }) => ({
          label: created_at,
          value: task_id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.robopost.app/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          apikey: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },
    async createVideoConfiguration(args = {}) {
      return this._makeRequest({
        path: "/video-series",
        method: "post",
        ...args,
      });
    },
    async generateVideo({
      configurationId, ...args
    }) {
      return this._makeRequest({
        path: `/video-tasks/${configurationId}/generate`,
        method: "post",
        ...args,
      });
    },
    async getVideoStatus({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `/video-tasks/${taskId}`,
        ...args,
      });
    },
    async getVideoSeries(args = {}) {
      return this._makeRequest({
        path: "/video-series",
        ...args,
      });
    },
    async getTaskStatus(args = {}) {
      return this._makeRequest({
        path: "/video-tasks",
        ...args,
      });
    },
  },
};
