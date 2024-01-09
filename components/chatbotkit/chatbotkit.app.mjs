import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatbotkit",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The bot id assigned to this conversation",
      async options() {
        const { items } = await this.listBots();
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "The ID of the dataset to use for the conversation",
      async options() {
        const { items } = await this.listDatasets();
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    skillsetId: {
      type: "string",
      label: "Skillset ID",
      description: "The ID of the skillset to use for the conversation",
      async options() {
        const { items } = await this.listSkillsets();
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for the conversation",
      async options() {
        const { items } = await this.listModels();
        return items.map(({ id }) => id);
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation to target",
      async options() {
        const { items } = await this.listConversations();
        return items.map(({ id }) => id);
      },
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text of the message",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chatbotkit.com/v1";
    },
    _headers() {
      return {
        Authorization: `Token ${this.$auth.token}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    listBots(opts = {}) {
      return this._makeRequest({
        path: "/bot/list",
        ...opts,
      });
    },
    listDatasets(opts = {}) {
      return this._makeRequest({
        path: "/dataset/list",
        ...opts,
      });
    },
    listSkillsets(opts = {}) {
      return this._makeRequest({
        path: "/skillset/list",
        ...opts,
      });
    },
    listModels(opts = {}) {
      return this._makeRequest({
        path: "/model/list",
        ...opts,
      });
    },
    listConversations(opts = {}) {
      return this._makeRequest({
        path: "/conversation/list",
        ...opts,
      });
    },
    createConversation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/conversation/create",
        ...opts,
      });
    },
    completeConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversation/${conversationId}/complete`,
        ...opts,
      });
    },
    attachDatasetFile({
      datasetId, fileId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/dataset/${datasetId}/file/${fileId}/attach`,
        ...opts,
      });
    },
    createFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/file/create",
        ...opts,
      });
    },
    uploadFile({
      fileId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/file/${fileId}/upload`,
        ...opts,
      });
    },
  },
};
