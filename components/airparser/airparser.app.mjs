import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airparser",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document to monitor",
    },
    extractionSchema: {
      type: "string",
      label: "Extraction Schema",
      description: "The user-defined extraction schema for data extraction",
      optional: true,
    },
    documentSource: {
      type: "string",
      label: "Document Source",
      description: "The source of the document for data extraction (file, text, or external URL)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.airparser.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getDocument(documentId) {
      return this._makeRequest({
        path: `/docs/${documentId}/extended`,
      });
    },
    async importDocument(documentSource, extractionSchema) {
      const form = new FormData();
      form.append("file", documentSource);
      form.append("meta", extractionSchema);
      return this._makeRequest({
        method: "POST",
        path: "/inboxes/<inbox_id>/upload",
        body: form,
      });
    },
    async uploadDocument(documentSource, extractionSchema) {
      const form = new FormData();
      form.append("file", documentSource);
      form.append("meta", extractionSchema);
      return this._makeRequest({
        method: "POST",
        path: "/inboxes/<inbox_id>/upload",
        body: form,
      });
    },
  },
};
