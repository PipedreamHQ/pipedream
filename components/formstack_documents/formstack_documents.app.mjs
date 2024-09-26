import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "formstack_documents",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document",
      description: "Identifier of a document",
      async options() {
        const documents = await this.listDocuments();
        return documents?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    documentType: {
      type: "string",
      label: "Type",
      description: "The type of document",
      options: constants.DOCUMENT_TYPES,
    },
    documentOutput: {
      type: "string",
      label: "Output",
      description: "The type of document to produce from merge",
      options: constants.DOCUMENT_OUTPUT_TYPES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.webmerge.me";
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: `${this.$auth.api_secret}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...args,
      });
    },
    getDocument({
      documentId, ...args
    }) {
      return this._makeRequest({
        path: `/api/documents/${documentId}`,
        ...args,
      });
    },
    listDocuments(args = {}) {
      return this._makeRequest({
        path: "/api/documents",
        ...args,
      });
    },
    createDocument(args = {}) {
      return this._makeRequest({
        path: "/api/documents",
        method: "POST",
        ...args,
      });
    },
    mergeDocument({
      documentId, documentKey, ...args
    }) {
      return this._makeRequest({
        path: `/merge/${documentId}/${documentKey}`,
        method: "POST",
        ...args,
      });
    },
  },
};
