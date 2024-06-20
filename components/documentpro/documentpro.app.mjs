import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "documentpro",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account",
      description: "The account used for authentication",
    },
    documentType: {
      type: "string",
      label: "Document Type",
      description: "Filter specific types of documents",
      optional: true,
      async options() {
        const templates = await this.getParsers();
        return templates.map((template) => ({
          label: template.template_title,
          value: template.template_type,
        }));
      },
    },
    document: {
      type: "string",
      label: "Document",
      description: "The file that should be uploaded",
    },
    mimeType: {
      type: "string",
      label: "MIME Type",
      description: "Specify the type of the uploaded document",
      optional: true,
    },
    parserId: {
      type: "string",
      label: "Parser ID",
      description: "The ID of the parser to use for uploading the document",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.documentpro.ai/v1";
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
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async getParsers(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    async emitNewDocumentEvent({
      account, documentType,
    }) {
      const path = "/webhooks";
      const data = {
        event: "document.uploaded",
        account,
        documentType,
      };
      return this._makeRequest({
        method: "POST",
        path,
        data,
      });
    },
    async uploadDocument({
      parserId, document, mimeType,
    }) {
      const formData = new FormData();
      formData.append("file", document);

      return this._makeRequest({
        method: "POST",
        path: `/files/upload/${parserId}`,
        headers: {
          "Content-Type": mimeType || "application/octet-stream",
        },
        data: formData,
      });
    },
  },
};
