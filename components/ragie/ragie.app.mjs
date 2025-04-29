import { axios } from "@pipedream/platform";
import { DOCUMENT_MODE_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "ragie",
  propDefinitions: {
    documentFile: {
      type: "string",
      label: "File",
      description: "The path to the file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    documentMode: {
      type: "string",
      label: "Mode",
      description: "Partition strategy for the document. Options are 'hi_res' or 'fast'.",
      optional: true,
      options: DOCUMENT_MODE_OPTIONS,
    },
    partition: {
      type: "string",
      label: "Partition",
      description: "An optional partition identifier. Partitions must be lowercase alphanumeric and may only include the special characters '_' and '-'.",
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document to update.",
      async options({ prevContext }) {
        const {
          documents, pagination,
        } = await this.listDocuments({
          params: {
            cursor: prevContext.cursor,
          },
        });
        return {
          options: documents.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: pagination.next_cursor,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ragie.ai";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    createDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        ...opts,
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        path: "/documents",
        params: opts,
      });
    },
    updateDocumentFile({
      documentId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/documents/${documentId}/file`,
        ...opts,
      });
    },
    listConnections(opts = {}) {
      return this._makeRequest({
        path: "/connections",
        params: opts,
      });
    },
    async *paginate({
      fn, params = {}, fieldName, maxResults = null, ...opts
    }) {
      let count = 0;
      let nextCursor;

      do {
        params.cursor = nextCursor;
        const {
          pagination,
          ...data
        } = await fn({
          params,
          ...opts,
        });
        const items = data[fieldName];

        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        nextCursor = pagination?.next_cursor;
      } while (nextCursor);
    },
  },
};
