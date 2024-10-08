import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdfmonkey",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The unique identifier of the document.",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The unique identifier of the document template.",
    },
    data: {
      type: "object",
      label: "Payload",
      description: "Data used for the document generation.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata to attach to the document.",
      optional: true,
    },
    documentName: {
      type: "string",
      label: "Document Name",
      description: "Optional name for the document.",
      optional: true,
    },
    additionalMetadata: {
      type: "object",
      label: "Additional Metadata",
      description: "Optional additional metadata for the document.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pdfmonkey.io/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createDocument({
      templateId, data, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        data: {
          document: {
            document_template_id: templateId,
            status: "pending",
            payload: data,
            meta: metadata,
          },
        },
      });
    },
    async deleteDocument(documentId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/documents/${documentId}`,
      });
    },
    async findDocument(documentId) {
      return this._makeRequest({
        method: "GET",
        path: `/documents/${documentId}`,
      });
    },
    async emitDocumentCompletion({
      documentId, documentName, additionalMetadata,
    }) {
      const document = await this.findDocument(documentId);
      if (document.status === "success") {
        this.$emit(document, {
          id: document.id,
          summary: `Document ${documentName || document.filename} Generation Completed`,
          ts: Date.now(),
          additionalMetadata,
        });
      }
    },
  },
};
