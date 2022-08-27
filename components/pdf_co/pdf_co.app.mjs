import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdf_co",
  propDefinitions: {},
  methods: {
    _getUrl(path) {
      return `https://api.pdf.co/v1${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getUrl(opts.path),
        headers: this._getHeaders(),
      };
    },
    async generateBarcode($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/barcode/generate",
        data: param,
      }));
      return response;
    },
  },
};
