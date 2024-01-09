import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatbotkit",
  propDefinitions: {
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation to target",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "Web-accessible URL to the file to import",
      optional: true,
    },
    datasetName: {
      type: "string",
      label: "Dataset Name",
      description: "Name of the dataset where the file should be imported",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "ID of the user to start a conversation with",
    },
    topicId: {
      type: "string",
      label: "Topic ID",
      description: "ID of the topic to direct the chat flow",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chatbotkit.com/v1";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async markConversationComplete(conversationId) {
      return this._makeRequest({
        method: "POST",
        path: `/conversation/${conversationId}/complete`,
      });
    },
    async importFile(fileUrl, datasetName) {
      return this._makeRequest({
        method: "POST",
        path: "/file/create",
        data: {
          file_url: fileUrl,
          dataset_name: datasetName,
        },
      });
    },
    async createConversation(userId, topicId) {
      return this._makeRequest({
        method: "POST",
        path: "/conversation/create",
        data: {
          user_id: userId,
          topic_id: topicId,
        },
      });
    },
  },
};
