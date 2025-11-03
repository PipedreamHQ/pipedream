import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "chatlayer",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "Unique identifier of the bot",
      async options() {
        const response = await this.getBots();
        return response.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Unique identifier of the user session",
      async options({
        botId, version,
      }) {
        const response = await this.getConversations({
          botId,
          params: {
            version,
          },
        });
        const sessions = response.data;
        return sessions.map(({ user }) => ({
          value: user.sessionId,
        }));
      },
    },
    version: {
      type: "string",
      label: "Version",
      description: "Bot version to use",
      options: constants.BOT_VERSIONS,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.url}`;
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
          Authorization: `Bearer ${this.$auth.access_token}`,
          ...headers,
        },
      });
    },

    async getConversations({
      botId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/bots/${botId}/conversations`,
        ...args,
      });
    },
    async listMessages({
      botId, sessionId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/bots/${botId}/conversations/${sessionId}/messages`,
        ...args,
      });
    },
    async getSessionData({
      botId, sessionId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/bots/${botId}/conversations/${sessionId}/session-data`,
        ...args,
      });
    },
    async getBots(args = {}) {
      return this._makeRequest({
        path: "/v1/bots",
        ...args,
      });
    },
  },
};
