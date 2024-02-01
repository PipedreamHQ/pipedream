import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cloudpress",
  propDefinitions: {
    connectionIds: {
      type: "integer[]",
      label: "Connection IDs",
      description: "Array of connection identifiers",
      async options({
        page, kind = "destination",
      }) {
        const { items } = await this.listConnections({
          params: {
            pageNo: page + 1,
          },
        });
        return items
          .filter((item) => item.kind === kind)
          .map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [];
      },
    },
    documentReference: {
      type: "string",
      label: "Document Reference",
      description: "Reference identifier of a document",
      async options({ page }) {
        const { items } = await this.listDocumentExports({
          params: {
            pageNo: page + 1,
          },
        });
        return items
          .map(({
            sourceDocumentReference: value, sourceDocumentTitle: label,
          }) => ({
            value,
            label,
          })) || [];
      },
    },
    collectionId: {
      type: "integer",
      label: "Collection ID",
      description: "Identifier of a collection",
      async options({ page }) {
        const { items } = await this.listCollections({
          params: {
            pageNo: page + 1,
          },
        });
        return items
          .map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.usecloudpress.com/v2";
    },
    _headers(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.personal_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      hookId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...args,
      });
    },
    listConnections(args = {}) {
      return this._makeRequest({
        path: "/connections",
        ...args,
      });
    },
    listDocumentExports(args = {}) {
      return this._makeRequest({
        path: "/document-exports",
        ...args,
      });
    },
    listCollections(args = {}) {
      return this._makeRequest({
        path: "/collections",
        ...args,
      });
    },
    exportCollection({
      collectionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/collections/${collectionId}/export`,
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    exportFromConnection(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/export/connection",
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
  },
};
