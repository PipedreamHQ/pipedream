import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hypeauditor",
  propDefinitions: {
    youtubeChannel: {
      type: "string",
      label: "YouTube Channel ID or Username",
      description: "The YouTube channel ID or username for which to generate a report.",
    },
    youtubeFeatures: {
      type: "string",
      label: "Features List",
      description: "Optional list of features to include in the YouTube report.",
      optional: true,
    },
    tiktokUser: {
      type: "string",
      label: "TikTok User Name or ID",
      description: "The TikTok username or ID for which to generate a report.",
    },
    twitchChannel: {
      type: "string",
      label: "Twitch Channel Username",
      description: "The Twitch channel username for which to generate a report.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://hypeauditor.com/api/method";
    },
    async _makeRequest({
      $ = this, path, headers, ...otherOpts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "x-auth-token": this.$auth.token,
          "x-auth-id": this.$auth.id,
        },
        ...otherOpts,
      });
    },
    async getYouTubeReport(opts = {}) {
      return this._makeRequest({
        path: "/auditor.youtube/",
        ...opts,
      });
    },
    async getTikTokReport(opts = {}) {
      return this._makeRequest({
        path: "/auditor.tiktok/",
        ...opts,
      });
    },
    async getTwitchReport(opts = {}) {
      return this._makeRequest({
        path: "/auditor.twitch/",
        ...opts,
      });
    },
  },
};
