import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stammer_ai",
  propDefinitions: {
    chatbotUuid: {
      type: "string",
      label: "Chatbot UUID",
      description: "Unique identifier (UUID) of the chatbot. You can find this UUID on the chatbot's detail page.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "Message or query the user intends to send to the chatbot. Must be under 2000 characters.",
    },
    userKey: {
      type: "string",
      label: "User Key",
      description: "A unique identifier/string, used to distinguish users interacting with the chatbot.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.stammer.ai/en/chatbot/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Token ${this.$auth.api_token}`,
        },
      });
    },
    async sendMessage(args) {
      return this._makeRequest({
        method: "POST",
        path: "/message/",
        ...args,
      });
    },
  },
};
