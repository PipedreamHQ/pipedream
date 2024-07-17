import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "documerge",
  propDefinitions: {
    documentTypes: {
      type: "string[]",
      label: "Document Types",
      description: "The types of documents to listen to for the trigger",
    },
    routeTypes: {
      type: "string[]",
      label: "Route Types",
      description: "The types of routes to listen to for the trigger",
    },
    fileUrlsOrIds: {
      type: "string[]",
      label: "File URLs or IDs",
      description: "Array of file URLs or IDs to merge",
    },
    pdfFileUrlOrId: {
      type: "string",
      label: "PDF File URL or ID",
      description: "URL or ID of the PDF file to extract data from",
    },
    fieldNames: {
      type: "string[]",
      label: "Field Names",
      description: "Array of field names to extract data from in the PDF file",
    },
    fileUrlOrId: {
      type: "string",
      label: "File URL or ID",
      description: "URL or ID of the file to convert into a PDF",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.documerge.ai/api";
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
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    },
    async mergeDocuments(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documents/merge",
        ...opts,
      });
    },
    async mergeRoutes(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/routes/merge",
        ...opts,
      });
    },
    async createDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        ...opts,
      });
    },
    async createRoute(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/routes",
        ...opts,
      });
    },
    async splitPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tools/pdf/split",
        ...opts,
      });
    },
    async convertToPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tools/pdf/convert",
        ...opts,
      });
    },
  },
};
