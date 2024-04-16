import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hansei",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "Identifier of a bot",
      async options() {
        const bots = await this.listBots();
        return bots?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    collectionIds: {
      type: "string[]",
      label: "Collection IDs",
      description: "The collections to which this source belongs",
      async options() {
        const collections = await this.listCollections();
        return collections?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "Conversation Id provides the bot with additional context of last few messages to answer the question. A new Conversation Id is created when it is not provided.",
      optional: true,
      async options({ botId }) {
        const conversations = await this.listConversations({
          botId,
        });
        return conversations?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional information about the webpage",
      optional: true,
    },
    question: {
      type: "string",
      label: "Question",
      description: "The inquiry to get an answer for",
    },
    file: {
      type: "any",
      label: "File",
      description: "The file you want to upload to the knowledge base",
    },
    filetype: {
      type: "string",
      label: "File Type",
      description: "The type of the file (text, word, pdf)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hansei.app/public/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this, path, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-KEY": this.$auth.api_key,
          "Content-Type": "application/json",
        },
      });
    },
    listBots(opts = {}) {
      return this._makeRequest({
        path: "/bots",
        ...opts,
      });
    },
    listCollections(opts = {}) {
      return this._makeRequest({
        path: "/collections",
        ...opts,
      });
    },
    listConversations({
      botId, ...opts
    }) {
      return this._makeRequest({
        path: `/bots/${botId}/conversations`,
        ...opts,
      });
    },
    addWebpage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sources/webpage",
        ...opts,
      });
    },
    getAnswerToQuestion(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sources/upload",
        ...opts,
      });
    },
  },
};
