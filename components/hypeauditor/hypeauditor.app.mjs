import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hypeauditor",
  propDefinitions: {
    twitchChannel: {
      type: "string",
      label: "Twitch Channel Username",
      description: "The Twitch username (e.g. `nasa`) from a Twitch channel URL (in this example, `https://www.twitch.tv/nasa`).",
    },
    username: {
      type: "string",
      label: "Username",
      description: "Username to request the report",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "User ID to request the report",
      optional: true,
    },
    channelUsername: {
      type: "string",
      label: "Channel Username",
      description: "Identify the user by their Channel Username",
      optional: true,
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "Identify the user by their Channel ID",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://hypeauditor.com/api/method";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "content-type": "application/x-www-form-urlencoded",
          "x-auth-id": `${this.$auth.client_id}`,
          "x-auth-token": `${this.$auth.api_token}`,
          "user-agent": "pipedream/1",
        },
      });
    },
    async getInstagramReport(args = {}) {
      return this._makeRequest({
        path: "/auditor.report/",
        method: "post",
        ...args,
      });
    },
    async getYoutubeReport(args = {}) {
      return this._makeRequest({
        path: "/auditor.youtube/",
        method: "post",
        ...args,
      });
    },
    async getTiktokReport(args = {}) {
      return this._makeRequest({
        path: "/auditor.tiktok",
        method: "post",
        ...args,
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
