import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "superdocu",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the document",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use when creating the document. Eg. `tpl_12345`",
      optional: true,
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document. Eg. `doc_abc123`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.superdocu.com";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    createDocument({
      title, templateId, ...opts
    } = {}) {
      const data = {
        title,
      };
      if (templateId) {
        data.template_id = templateId;
      }
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        data,
        ...opts,
      });
    },
    getDocument({
      documentId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/documents/${documentId}`,
        ...opts,
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        path: "/documents",
        ...opts,
      });
    },
    sendDocument({
      documentId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/send`,
        ...opts,
      });
    },
  },
};
