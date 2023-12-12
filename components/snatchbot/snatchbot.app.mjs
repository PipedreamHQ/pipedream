import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "snatchbot",
  propDefinitions: {
    messageId: {
      type: "string",
      label: "Message ID",
      description: "Identifier of the message to retrieve. Set to 0 to retrieve all messages.",
      optional: true,
      default: "0",
      async options({ userId }) {
        const { messages } = await this.listMessages({
          params: {
            user_id: userId,
            message_id: 0,
          },
        });
        return messages?.map(({
          id, message,
        }) => ({
          label: message,
          value: id,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID in your application",
    },
  },
  methods: {
    _baseUrl() {
      return "https://account.snatchbot.me/channels/api/api/id";
    },
    _urlAuth() {
      return `${this.$auth.bot_id}/app${this.$auth.app_id}/aps${this.$auth.app_secret}`;
    },
    async _makeRequest({
      $ = this,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${this._urlAuth()}`,
        ...args,
      });
    },
    listMessages(args = {}) {
      return this._makeRequest({
        ...args,
      });
    },
    postMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
