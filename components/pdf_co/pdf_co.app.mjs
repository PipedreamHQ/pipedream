import { axios } from "@pipedream/platform";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdf_co",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "URL to the source file. Supports links from Google Drive, Dropbox and from built-in PDF.co files storage.",
    },
    httpusername: {
      type: "string",
      label: "HTTP Username",
      description: "HTTP auth user name if required to access source url.",
      optional: true,
    },
    httppassword: {
      type: "string",
      label: "HTTP Password",
      description: "HTTP auth password if required to access source url.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "File name for generated output.",
      optional: true,
    },
    expiration: {
      type: "integer",
      label: "Expiration",
      description: "Output link expiration in minutes. Default is 60 (i.e. 60 minutes or 1 hour).",
      optional: true,
    },
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
    async convertAnythingToPDF($ = this, sourceType, param) {
      switch (sourceType) {
      case "CSV":
        return this.convertFromCSVToPDF($, param);
      case "DOC":
        return this.convertFromDOCToPDF($, param);
      case "IMAGE":
        return this.convertFromImageToPDF($, param);
      case "URL":
        return this.convertFromUrlToPDF($, param);
      case "EMAIL":
        return this.convertFromEmailToPDF($, param);
      case "HTML":
        return this.convertFromHtmlToPDF($, param);
      case "XLS":
        return this.convertFromXLSToPDF($, param);
      default:
        throw new ConfigurationError("Invalid source type.");
      }
    },
    async convertFromCSVToPDF($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/pdf/convert/from/csv",
        data: this.filterEmptyValues(param),
      }));
      return response;
    },
    async convertFromDOCToPDF($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/pdf/convert/from/doc",
        data: this.filterEmptyValues(param),
      }));
      return response;
    },
    async convertFromImageToPDF($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/pdf/convert/from/image",
        data: this.filterEmptyValues(param),
      }));
      return response;
    },
    async convertFromUrlToPDF($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/pdf/convert/from/url",
        data: this.filterEmptyValues(param),
      }));
      return response;
    },
    async convertFromHtmlToPDF($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/pdf/convert/from/html",
        data: this.filterEmptyValues(param),
      }));
      return response;
    },
    async convertFromEmailToPDF($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/pdf/convert/from/email",
        data: this.filterEmptyValues(param),
      }));
      return response;
    },
    async convertFromXLSToPDF($ = this, param) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path: "/xls/convert/to/pdf",
        data: this.filterEmptyValues(param),
      }));
      return response;
    },
  },
};
