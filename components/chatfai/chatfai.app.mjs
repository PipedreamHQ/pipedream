import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatfai",
  propDefinitions: {
    characterId: {
      type: "string",
      label: "Character ID",
      description: "ID of a public ChatFAI character",
    },
    conversation: {
      type: "string[]",
      label: "Conversation",
      description: "The current chat conversation as an array of JSON strings",
    },
    name: {
      type: "string",
      label: "Character Name",
      description: "The name of the character you want",
      optional: true,
    },
    content: {
      type: "string",
      label: "Message Content",
      description: "Message text content",
    },
    bio: {
      type: "string",
      label: "Character Bio",
      description: "The bio of the character you want",
      optional: true,
    },
    useInternalOptimizations: {
      type: "boolean",
      label: "Use Internal Optimizations",
      description: "Set to false if you want to disable internal optimizations for memory and reply quality",
      optional: true,
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The search query to find public characters",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chatfai.com/v1";
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async generateMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat",
        ...args,
      });
    },
    async getCharacter({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/characters/${id}`,
        ...args,
      });
    },
    async searchCharacters(args = {}) {
      return this._makeRequest({
        path: "/characters/search",
        ...args,
      });
    },
  },
};
