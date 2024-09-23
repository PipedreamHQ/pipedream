import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "documenso",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the pre-existing template",
      async options({ page }) {
        const { templates } = await this.listTemplates({
          params: {
            page: page + 1,
          },
        });
        return templates?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document",
      async options({ page }) {
        const { documents } = await this.listDocuments({
          params: {
            page: page + 1,
          },
        });
        return documents?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.url}/api/v1`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `${this.$auth.api_token}`,
        },
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        path: "/documents",
        ...opts,
      });
    },
    getDocument({
      documentId, ...opts
    }) {
      return this._makeRequest({
        path: `/documents/${documentId}`,
        ...opts,
      });
    },
    createDocumentFromTemplate({
      templateId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/templates/${templateId}/generate-document`,
        ...opts,
      });
    },
    sendDocumentForSigning({
      documentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/send`,
        ...opts,
      });
    },
    addRecipientToDocument({
      documentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentId}/recipients`,
        ...opts,
      });
    },
  },
};
