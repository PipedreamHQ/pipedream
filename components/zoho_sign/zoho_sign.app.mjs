import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_sign",
  propDefinitions: {
    fieldType: {
      type: "string",
      label: "Field Type",
      description: "Identifier of a field type",
      async options() {
        const { field_types: fieldTypes } = await this.listFieldTypes();
        return fieldTypes?.map(({ field_type_name: name }) => name ) || [];
      },
    },
    documentId: {
      type: "string",
      label: "Document",
      description: "Identifier of a document",
      async options({ prevContext }) {
        const { index = 1 } = prevContext;
        const params = {
          start_index: index,
          row_count: 25,
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
            index: index + params.row_count,
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
    listFieldTypes(args = {}) {
      return this._makeRequest({
        path: "/fieldtypes",
        ...args,
      });
    },
    listDocuments(args = {}) {
      return this._makeRequest({
        path: "/requests",
        ...args,
      });
    },
    sendDocument({
      requestId, ...args
    }) {
      return this._makeRequest({
        path: `/requests/${requestId}/submit`,
        method: "POST",
        ...args,
      });
    },
  },
};
