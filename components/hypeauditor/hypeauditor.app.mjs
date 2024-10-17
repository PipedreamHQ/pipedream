import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hypeauditor",
  version: "0.0.ts",
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
    instagramUser: {
      type: "string",
      label: "Instagram User Name or ID",
      description: "The Instagram username or ID for which to generate a report.",
    },
    twitchChannel: {
      type: "string",
      label: "Twitch Channel Username",
      description: "The Twitch channel username for which to generate a report.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://hypeauditor.com/api/method/auditor";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "X-Auth-Token": this.$auth.token,
          "X-Auth-Id": this.$auth.id,
        },
        ...otherOpts,
      });
    },
    async getYouTubeReport(opts = {}) {
      const {
        channel, features,
      } = opts;
      const params = {
        channel,
      };
      if (features) {
        params.features = features;
      }
      return this._makeRequest({
        path: "/youtube/",
        params,
      });
    },
    async getTikTokReport(opts = {}) {
      const { channel } = opts;
      return this._makeRequest({
        path: "/tiktok/",
        params: {
          channel,
        },
      });
    },
    async getInstagramReport(opts = {}) {
      const { channel } = opts;
      return this._makeRequest({
        path: "/instagram/",
        params: {
          channel,
        },
      });
    },
    async getTwitchReport(opts = {}) {
      const { channel } = opts;
      return this._makeRequest({
        path: "/twitch/",
        params: {
          channel,
        },
      });
    },
  },
};
