import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatfai",
  propDefinitions: {
    characterId: {
      type: "string",
      label: "Character ID",
      description: "The ID of the character",
    },
    conversation: {
      type: "string[]",
      label: "Conversation",
      description: "The conversation array with sender and content",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to send",
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The query used to search for public characters",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chatfai.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
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
      });
    },
    async generateMessageReply({
      characterId, conversation,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/chat",
        data: {
          character_id: characterId,
          conversation: conversation.map(JSON.parse),
        },
      });
    },
    async getPublicCharacterById({ characterId }) {
      return this._makeRequest({
        path: `/characters/${characterId}`,
      });
    },
    async searchPublicCharacters({ searchQuery }) {
      return this._makeRequest({
        path: "/characters/search",
        params: {
          query: searchQuery,
        },
      });
    },
  },
  version: `0.0.${new Date().getTime()}`,
};
