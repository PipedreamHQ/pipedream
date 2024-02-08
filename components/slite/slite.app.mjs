import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "slite",
  propDefinitions: {
    parentId: {
      type: "string",
      label: "Parent ID",
      description: "The ID of the parent document or channel",
    },
    docTitle: {
      type: "string",
      label: "Document Title",
      description: "The title of the new document",
    },
    docId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document to modify",
    },
    updateData: {
      type: "object",
      label: "Update Data",
      description: "The information to update in the document",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of sub-documents to retrieve",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.slite.com";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createDocument({
      parentId, docTitle,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/documents",
        data: {
          parent: parentId,
          title: docTitle,
        },
      });
    },
    async retrieveSubDocuments({
      parentId, limit,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/api/v1/documents/${parentId}/children`,
        params: {
          limit,
        },
      });
    },
    async modifyDocumentSection({
      docId, updateData,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/api/v1/documents/${docId}`,
        data: updateData,
      });
    },
  },
};
