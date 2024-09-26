import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docsumo",
  propDefinitions: {
    documentType: {
      type: "string",
      label: "Document Type",
      description: "The type of document to process",
      async options() {
        const res = await this.getUserDetails();
        return res.data.document_types.map((documentType) => {
          return {
            label: documentType.title,
            value: documentType.value,
          };
        });
      },
    },
  },
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://app.docsumo.com/api/v1/eevee/apikey";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "apikey": this._getApiKey(),
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async getUserDetails(ctx = this) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/limit",
      }, ctx);
    },
    async uploadDocument(data, ctx = this) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/upload/custom/",
        data,
      }, ctx);
    },
    async listDocuments(params, ctx) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/documents/all/",
        params,
      }, ctx);
    },
  },
};
