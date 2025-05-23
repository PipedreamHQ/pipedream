import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdforge",
  propDefinitions: {
    s3bucket: {
      type: "string",
      label: "S3 Bucket",
      description: "The ID of the active S3 connection to store the generated file on",
    },
    s3key: {
      type: "string",
      label: "S3 Key",
      description: "The path and filename without extension for saving the file in the S3 bucket",
      secret: true,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The filename without extension for saving the file in the `/tmp` direcrtory",
    },
    webhook: {
      type: "string",
      label: "Webhook URL",
      description: "The URL of your webhook endpoint",
    },
  },
  methods: {
    _baseUrl(baseUrl) {
      return baseUrl || "https://api.pdforge.com/v1";
    },
    _headers(removeHeader = false) {
      return removeHeader
        ? {}
        : {
          Authorization: `Bearer ${this.$auth.api_key}`,
        };
    },
    _makeRequest({
      $ = this, baseUrl, removeHeader, path = "", ...opts
    }) {
      return axios($, {
        url: this._baseUrl(baseUrl) + path,
        headers: this._headers(removeHeader),
        ...opts,
      });
    },
    generateDocumentFromTemplate({
      asyncMode, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/pdf/${asyncMode
          ? "async"
          : "sync"}`,
        ...opts,
      });
    },
    generatePDFfromHTML({
      asyncMode, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/html-to-pdf/${asyncMode
          ? "async"
          : "sync"}`,
        ...opts,
      });
    },
  },
};
