import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dynalist",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document",
    },
    newTitle: {
      type: "string",
      label: "New Title",
      description: "The new title for the document or content",
    },
    oldTitle: {
      type: "string",
      label: "Old Title",
      description: "The old title of the document (for error checking)",
      optional: true,
    },
    contentToInsert: {
      type: "string",
      label: "Content to Insert",
      description: "The content to insert into the document",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://dynalist.io/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, data, headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        data,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
        ...otherOpts,
      });
    },
    async editDocumentTitle({
      documentId, newTitle,
    }) {
      return this._makeRequest({
        path: "/doc/edit",
        data: {
          token: this.$auth.oauth_access_token,
          file_id: documentId,
          title: newTitle,
        },
      });
    },
    async fetchDocumentContent({ documentId }) {
      return this._makeRequest({
        path: "/doc/read",
        data: {
          token: this.$auth.oauth_access_token,
          file_id: documentId,
        },
      });
    },
    async insertContentToDocument({
      documentId, contentToInsert,
    }) {
      return this._makeRequest({
        path: "/doc/edit",
        data: {
          token: this.$auth.oauth_access_token,
          file_id: documentId,
          changes: [
            {
              action: "insert",
              parent_id: documentId,
              index: -1, // Append to the end
              content: contentToInsert,
            },
          ],
        },
      });
    },
  },
};
