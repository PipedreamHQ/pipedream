import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gpt_trainer",
  propDefinitions: {
    chatbotUuid: {
      type: "string",
      label: "Chatbot UUID",
      description: "The UUID of the chatbot",
    },
    sessionUuid: {
      type: "string",
      label: "Session UUID",
      description: "The UUID of the chatbot session",
    },
    chatbotName: {
      type: "string",
      label: "Chatbot Name",
      description: "The name of the chatbot",
    },
    chatbotPrompt: {
      type: "string",
      label: "Chatbot Prompt",
      description: "The prompt for the chatbot",
      optional: true,
    },
    chatbotTemperature: {
      type: "number",
      label: "Chatbot Temperature",
      description: "The temperature setting for the chatbot",
      optional: true,
      min: 0,
      max: 1,
    },
    chatbotModel: {
      type: "string",
      label: "Chatbot Model",
      description: "The model of the chatbot",
      optional: true,
    },
    chatbotVisibility: {
      type: "string",
      label: "Chatbot Visibility",
      description: "The visibility of the chatbot",
      optional: true,
    },
    chatbotRateLimit: {
      type: "integer[]",
      label: "Chatbot Rate Limit",
      description: "The rate limit settings for the chatbot",
      optional: true,
    },
    chatbotRateLimitMessage: {
      type: "string",
      label: "Chatbot Rate Limit Message",
      description: "The rate limit message for the chatbot",
      optional: true,
    },
    chatbotShowCitations: {
      type: "boolean",
      label: "Chatbot Show Citations",
      description: "Whether the chatbot should show citations",
      optional: true,
    },
    messageQuery: {
      type: "string",
      label: "Message Query",
      description: "The query message to send to the chatbot session",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.gpt-trainer.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createChatbot(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chatbot/create",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: opts.chatbotName,
          prompt: opts.chatbotPrompt,
          temperature: opts.chatbotTemperature,
          model: opts.chatbotModel,
          rate_limit: opts.chatbotRateLimit,
          rate_limit_message: opts.chatbotRateLimitMessage,
          show_citations: opts.chatbotShowCitations,
          visibility: opts.chatbotVisibility,
        },
      });
    },
    async createChatSession(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/chatbot/${opts.chatbotUuid}/session/create`,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    async createSessionMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/session/${opts.sessionUuid}/message/stream`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          query: opts.messageQuery,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
