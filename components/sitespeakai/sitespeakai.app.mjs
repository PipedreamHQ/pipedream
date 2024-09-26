import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sitespeakai",
  propDefinitions: {
    chatbotId: {
      type: "string",
      label: "Chatbot",
      description: "The ID of your chatbot. You can find the ID on the settings page for your chatbot.",
      async options() {
        const chatbots = await this.listChatbots();
        return chatbots?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sitespeak.ai/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listChatbots(args = {}) {
      return this._makeRequest({
        path: "/me/chatbots",
        ...args,
      });
    },
    listLeads({
      chatbotId, ...args
    }) {
      return this._makeRequest({
        path: `/${chatbotId}/leads`,
        ...args,
      });
    },
    sendQuery({
      chatbotId, ...args
    }) {
      return this._makeRequest({
        path: `/${chatbotId}/query`,
        method: "POST",
        ...args,
      });
    },
  },
};
