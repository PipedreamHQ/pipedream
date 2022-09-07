import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdf_co",
  propDefinitions: {
    async: {
      type: "boolean",
      label: "Async",
      description: "Runs processing asynchronously. Returns JobId.",
      optional: true,
    },
    profiles: {
      type: "any",
      label: "Profiles",
      description: "Use this parameter to set additional configuration for fine tuning and extra options. [Explore PDF.co](https://apidocs.pdf.co/kb/OCR/how-to-add-profile-to-pdfco-request) for profile examples.",
      optional: true,
    },
  },
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
    filterEmptyValues(obj) {
      return Object.entries(obj)
        .reduce((reduction,
          [
            key,
            value,
          ]) => {
          if (value === undefined || value === null) {
            return reduction;
          }
          return {
            ...reduction,
            [key]: value,
          };
        }, {});
    },
    async generateBarcode($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/barcode/generate",
        data: this.filterEmptyValues(param),
      }));
      return response;
    },
    async readBarcode($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/barcode/read/from/url",
        data: this.filterEmptyValues(param),
      }));
      return response;
    },
  },
};
