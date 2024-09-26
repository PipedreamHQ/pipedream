import { axios } from "@pipedream/platform";
import { prepareSessionLabel } from "./common/utils.mjs";

export default {
  type: "app",
  app: "chatfly",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The ID of the bot to send the message to.",
      async options() {
        const data = await this.listBots();

        return data.map(({
          id: value, bot_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send.",
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The session ID for the message. To initiate a new session, use a unique string in a Custom Expression, for example: `8g12h`",
      async options({ botId }) {
        const data = await this.listSessions({
          params: {
            bot_id: botId,
          },
        });

        return data.map(({
          session_id: value, chat_history_response,
        }) => ({
          label: prepareSessionLabel(chat_history_response),
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://backend.chatfly.co/api";
    },
    _headers() {
      return {
        "CHATFLY-API-KEY": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    dispatchMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat/get-streaming-response",
        ...opts,
      });
    },
    listBots(opts = {}) {
      return this._makeRequest({
        path: "/bot",
        ...opts,
      });
    },
    listSessions(opts = {}) {
      return this._makeRequest({
        path: "/chat/history",
        ...opts,
      });
    },
  },
};
