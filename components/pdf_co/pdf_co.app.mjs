import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdf_co",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "URL to the source file. Supports links from Google Drive, Dropbox and from built-in PDF.co files storage.",
    },
    urls: {
      type: "string[]",
      label: "URL",
      description: "Array of urls to the source PDF files in the same order that you want them to be processed. Supports links from Google Drive, Dropbox and from built-in PDF.co files storage.",
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
    searchString: {
      type: "string",
      label: "Search String",
      description: "Text to search for on pages.",
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
    pages: {
      type: "string",
      label: "Pages",
      description: "For ALL pages just leave this param empty. Comma-separated list of page indices (or ranges) to process. the very first page starts at 0 (zero). To set a range use the dash -, for example: 0,2-5,7-. To set a range from index to the last page use range like this: 2- (from page #3 as the index starts at zero and till the end of the document). Example: 0,2-5,7- means first page, then 3rd page to 6th page, and then the range from 8th (index = 7) page till the end of the document.",
      optional: true,
    },
    inline: {
      type: "boolean",
      label: "Inline",
      description: "Must be one of: true to return data as inline or false to return link to output file (default).",
      optional: true,
    },
    password: {
      type: "string",
      label: "PDF Password",
      description: "Password of PDF file.",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Lang",
      description: "Sets language for OCR (text from image) to use for scanned PDF, PNG, JPG documents input when extracting text. Default is “eng”. Other languages are also supported: deu, spa, chi_sim, jpn and many others (full list of supported OCR languages is (here)[https://apidocs.pdf.co/kb/OCR/list-of-supported-languages-for-ocr]. You can also use 2 languages simultaneously like this: eng+deu or jpn+kor (any combination).",
      optional: true,
    },
    caseSensitive: {
      type: "boolean",
      label: "Case Sensitive",
      description: "Defines if keywords in rules are case sensitive or not.",
      optional: true,
    },
    excludeKeyPages: {
      type: "boolean",
      label: "Exclude Key Pages",
      description: "Set to true if you want to exclude pages where text was found. false by default.",
      optional: true,
    },
    regexSearch: {
      type: "boolean",
      label: "Regex Search",
      description: "Set to true to enable regular expressions for search string. false by default.",
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
      if (!obj) {
        return obj;
      }
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
    async genericRequest($ = this, payload, path, params, method = "POST") {
      const response = await axios($, this._getRequestParams({
        method,
        path,
        data: this.filterEmptyValues(payload),
        params: this.filterEmptyValues(params),
      }));
      return response;
    },
  },
};
