import { axios } from "@pipedream/platform";
import { truncate } from "./common/utils.mjs";

export default {
  type: "app",
  app: "dynalist",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document.",
      async options() {
        const { files } = await this.listDocuments();

        return files
          .filter((file) => file.type === "document")
          .map(({
            id: value, title: label,
          }) => ({
            label,
            value,
          }));
      },
    },
    parentId: {
      type: "string",
      label: "Parent ID",
      description: "The ID of the parent item to insert under.",
      async options({ documentId }) {
        const { nodes } = await this.fetchDocumentContent({
          data: {
            file_id: documentId,
          },
        });

        return nodes.map(({
          id: value, content,
        }) => ({
          label: truncate(content),
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://dynalist.io/api/v1";
    },
    _data(data = {}) {
      return {
        "token": `${this.$auth.api_token}`,
        ...data,
      };
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        data: this._data(data),
        ...opts,
      });
    },
    editDocumentTitle(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/file/edit",
        ...opts,
      });
    },
    fetchDocumentContent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/doc/read",
        ...opts,
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/file/list",
        ...opts,
      });
    },
    insertContentToDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/doc/edit",
        ...opts,
      });
    },
  },
};
