import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cody",
  version: "0.0.1",
  propDefinitions: {
    contentMessage: {
      type: "string",
      label: "Content Message",
      description: "The content of the message to send.",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation where the message will be sent.",
    },
    documentText: {
      type: "string",
      label: "Document Text",
      description: "The text content of the document to be added to your knowledge base.",
    },
    documentTitle: {
      type: "string",
      label: "Document Title",
      description: "The title of the document (optional).",
      optional: true,
    },
    documentCategory: {
      type: "string",
      label: "Document Category",
      description: "The category of the document (optional).",
      optional: true,
    },
    documentAuthor: {
      type: "string",
      label: "Document Author",
      description: "The author of the document (optional).",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The file path of the document to be uploaded.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://getcody.ai/api/v1";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async sendMessage({
      contentMessage, conversationId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        data: {
          content: contentMessage,
          conversation_id: conversationId,
        },
      });
    },
    async createDocument({
      documentText, documentTitle, documentCategory, documentAuthor,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        data: {
          content: documentText,
          name: documentTitle,
          category: documentCategory,
          author: documentAuthor,
        },
      });
    },
    async uploadFile({ filePath }) {
      const {
        url, key,
      } = await this._makeRequest({
        method: "POST",
        path: "/uploads/signed-url",
        data: {
          file_name: filePath.split("/").pop(),
          content_type: "application/octet-stream",
        },
      });
      await axios({
        method: "PUT",
        url: url,
        headers: {
          "Content-Type": "application/octet-stream",
        },
        data: require("fs").createReadStream(filePath),
      });
      return {
        key,
      };
    },
  },
};
