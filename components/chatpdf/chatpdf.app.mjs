import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatpdf",
  propDefinitions: {
    url: {
      type: "string",
      label: "PDF URL",
      description: "The URL of the publicly accessible PDF",
    },
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "The source ID of the PDF in chatpdf",
    },
    messages: {
      type: "string[]",
      label: "Messages",
      description: "An array of messages to interact with the PDF",
    },
    sourceIds: {
      type: "string[]",
      label: "Source IDs",
      description: "An array of source IDs of the PDFs to delete",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.chatpdf.com/v1";
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async addPdfByUrl({ url }) {
      return this._makeRequest({
        method: "POST",
        path: "/sources/add-url",
        data: {
          url,
        },
      });
    },
    async sendMessageToPdf({
      sourceId, messages,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/chats/message",
        data: {
          sourceId,
          messages: messages.map((content) => ({
            role: "user",
            content,
          })),
        },
      });
    },
    async deletePdfs({ sourceIds }) {
      return this._makeRequest({
        method: "POST",
        path: "/sources/delete",
        data: {
          sources: sourceIds,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
