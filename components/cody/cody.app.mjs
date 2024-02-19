import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cody",
  propDefinitions: {
    contentMessage: {
      type: "string",
      label: "Content Message",
      description: "The content of the message to send.",
    },
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The ID of the bot.",
      async options({ page }) {
        const { data } = await this.listBots({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation where the message will be sent.",
      async options({
        page, botId,
      }) {
        const { data } = await this.listConversations({
          params: {
            page,
            bot_id: botId,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    documentText: {
      type: "string",
      label: "Document Text",
      description: "The text content of the document to be added to your knowledge base.",
    },
    folderId: {
      type: "string",
      label: "Folder Id",
      description: "The Identifier of the folder.",
      async options({ page }) {
        const { data } = await this.listFolders({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://getcody.ai/api/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listBots(opts = {}) {
      return this._makeRequest({
        path: "/bots",
        ...opts,
      });
    },
    listConversations(opts = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...opts,
      });
    },
    listFolders(opts = {}) {
      return this._makeRequest({
        path: "/folders",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    createDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        ...opts,
      });
    },
  },
};
