import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdffiller",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to be monitored",
    },
    sourceTemplateId: {
      type: "string",
      label: "Source Template ID",
      description: "The ID of the source template",
    },
    targetTemplateId: {
      type: "string",
      label: "Target Template ID",
      description: "The ID of the target template",
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document to be monitored",
    },
    document: {
      type: "string",
      label: "Document",
      description: "The document to be transformed into a fillable form",
    },
    file: {
      type: "string",
      label: "File",
      description: "The file to be uploaded",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the document to be searched",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pdffiller.com/v2";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createCallback({
      documentId, eventId, callbackUrl,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/callbacks",
        data: {
          document_id: documentId,
          event_id: eventId,
          callback_url: callbackUrl,
        },
      });
    },
    async transformDocumentToForm({ document }) {
      return this._makeRequest({
        method: "POST",
        path: "/fillable-forms",
        data: {
          document_id: document,
        },
      });
    },
    async generateShareableLink({ documentId }) {
      return this._makeRequest({
        method: "POST",
        path: `/templates/${documentId}/share`,
      });
    },
    async uploadFile({ file }) {
      return this._makeRequest({
        method: "POST",
        path: "/templates",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: file,
      });
    },
    async searchDocumentsByName({ name }) {
      return this._makeRequest({
        method: "GET",
        path: "/templates",
        params: {
          name,
        },
      });
    },
    async authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
