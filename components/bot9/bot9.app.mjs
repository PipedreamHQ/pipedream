import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bot9",
  propDefinitions: {
    chatbotId: {
      type: "string",
      label: "Chatbot ID",
      description: "The unique identifier for your Bot9 chatbot.",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The unique identifier for the conversation.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The chat message to send to the bot.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source from where the chat is initiated (e.g., WhatsApp, Facebook, etc.).",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the chat.",
      async options() {
        // Assuming there's an endpoint to fetch statuses, otherwise return static options
        return [
          {
            label: "Active",
            value: "active",
          },
        ];
      },
      default: "active",
    },
    externalSessionId: {
      type: "string",
      label: "External Session ID",
      description: "An ID you want to reference from an external system, such as your own database.",
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "The name of the user.",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "An ID you want to reference from an external system, such as your own database user ID.",
    },
    emailId: {
      type: "string",
      label: "Email ID",
      description: "The email ID of the user.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://apiv1.bot9.ai/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async startConversation({
      chatbotId, source, status, externalSessionId, userName, externalId, emailId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${chatbotId}/conversations`,
        data: {
          Source: source,
          Status: status,
          ExternalSessionId: externalSessionId,
          user: {
            name: userName,
            externalId: externalId,
            emailId: emailId,
          },
        },
      });
    },
    async sendMessage({
      chatbotId, conversationId, message,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${chatbotId}/conversations/${conversationId}/chat`,
        data: {
          message: message,
        },
      });
    },
    // Added from requirements
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
