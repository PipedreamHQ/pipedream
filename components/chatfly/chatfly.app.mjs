import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatfly",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The ID of the bot to send the message to.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send.",
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The session ID for the message.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://backend.chatfly.co/api";
    },
    async dispatchMessage({
      botId, message, sessionId,
    }) {
      return axios(this, {
        method: "POST",
        url: `${this._baseUrl()}/chat/get-streaming-response`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data: {
          bot_id: botId,
          message: message,
          session_id: sessionId,
        },
      });
    },
  },
};
