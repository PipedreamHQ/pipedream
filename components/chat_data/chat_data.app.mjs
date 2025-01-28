import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "chat_data",
  propDefinitions: {
    chatbotId: {
      type: "string",
      label: "Employee ID",
      description: "The employee ID",
      async options() {
        const response = await this.getChatbots();

        const chatbotIds = response.chatbots;

        return chatbotIds.map(({
          chatbotId, chatbotName,
        }) => ({
          value: chatbotId,
          label: chatbotName,
        }));
      },
    },
    chatbotName: {
      type: "string",
      label: "Chatbot Name",
      description: "Name of the Chatbot",
    },
    sourceText: {
      type: "string",
      label: "Source Text",
      description: "Text data for the chatbot, subject to character limits based on your plan. Relevant only if the model is custom-data-upload",
      optional: true,
    },
    urlsToScrape: {
      type: "string[]",
      label: "URLs to Scrape",
      description: "A list of URLs is for text content extraction by Chat Data, i.e.: `https://www.chat-data.com`. Relevant only if the model is custom-data-upload",
      optional: true,
    },
    customBackend: {
      type: "string",
      label: "Custom Backend",
      description: "The URL of a customized backend for the chatbot",
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "The chatbot defaults to `custom-data-upload` if the model parameter is not provided",
      options: constants.CHATBOT_MODELS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chat-data.com/api/v2";
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
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createChatbot(args = {}) {
      return this._makeRequest({
        path: "/create-chatbot",
        method: "post",
        ...args,
      });
    },
    async getChatbotStatus({
      chatbotId, ...args
    }) {
      return this._makeRequest({
        path: `/chatbot/status/${chatbotId}/`,
        ...args,
      });
    },
    async deleteChatbot({
      chatbotId, ...args
    }) {
      return this._makeRequest({
        path: `/delete-chatbot/${chatbotId}/`,
        method: "delete",
        ...args,
      });
    },
    async getChatbots(args = {}) {
      return this._makeRequest({
        path: "/get-chatbots",
        ...args,
      });
    },
  },
};
