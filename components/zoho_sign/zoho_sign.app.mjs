import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_sign",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template",
      description: "Identifier of a template",
      async options({ prevContext }) {
        const { index = 1 } = prevContext;
        const params = {
          data: {
            page_context: {
              start_index: index,
              row_count: 25,
            },
          },
        };
        const { templates } = await this.listTemplates({
          params,
        });
        const options = templates?.map(({
          template_id: value, template_name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            index: index + params.data.page_context.row_count,
          },
        };
      },
    },
    documentId: {
      type: "string",
      label: "Document",
      description: "Identifier of a document",
      async options({ prevContext }) {
        const { index = 1 } = prevContext;
        const params = {
          data: {
            page_context: {
              start_index: index,
              row_count: 25,
            },
          },
        };
        const { requests } = await this.listDocuments({
          params,
        });
        const options = requests?.map(({
          request_id: value, request_name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            index: index + params.data.page_context.row_count,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.base_api_uri}/api/v1`;
    },
    _headers() {
      return {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getDocumentDetails({
      documentId, ...args
    }) {
      return this._makeRequest({
        path: `/requests/${documentId}`,
        ...args,
      });
    },
    getDocumentFormDetail({
      documentId, ...args
    }) {
      return this._makeRequest({
        path: `/requests/${documentId}/fielddata`,
        ...args,
      });
    },
    getTemplate({
      templateId, ...args
    }) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
        ...args,
      });
    },
    listDocuments(args = {}) {
      return this._makeRequest({
        path: "/requests",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    sendDocumentFromTemplate({
      templateId, ...args
    }) {
      return this._makeRequest({
        path: `/templates/${templateId}/createdocument`,
        method: "POST",
        ...args,
      });
    },
  },
};
