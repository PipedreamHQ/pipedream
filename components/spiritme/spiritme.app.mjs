import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "spiritme",
  propDefinitions: {
    avatarId: {
      type: "string",
      label: "Avatar ID",
      description: "The identifier of the avatar",
      required: true,
    },
    systemStatusNotifications: {
      type: "boolean",
      label: "System Status Notifications",
      description: "Enable notifications for success, failure, insufficient balance",
      optional: true,
    },
    voice: {
      type: "object",
      label: "Voice",
      description: "Characteristics of the voice to be used, such as pitch, speed, and accent",
      required: true,
    },
    avatar: {
      type: "string",
      label: "Avatar",
      description: "The identifier for the avatar to be used",
      optional: true,
    },
    videoLength: {
      type: "integer",
      label: "Video Length",
      description: "The length of the video in seconds",
      optional: true,
    },
    script: {
      type: "string",
      label: "Script",
      description: "The script for the video",
      optional: true,
    },
    desiredAnimation: {
      type: "string",
      label: "Desired Animation",
      description: "Desired animation for the video",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.spiritme.tech/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        data,
        params,
        headers: {
          ...headers,
          "Authorization": `Token ${this.$auth.api_key}`,
        },
      });
    },
    async getVideoStatus(videoId) {
      return this._makeRequest({
        path: `/videos/${videoId}/`,
      });
    },
    async generateVideo(voice, avatar, videoLength, script, desiredAnimation) {
      return this._makeRequest({
        method: "POST",
        path: "/videos/",
        data: {
          voice,
          avatar,
          video_length: videoLength,
          script,
          desired_animation: desiredAnimation,
        },
      });
    },
  },
};
