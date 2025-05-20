import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdforge",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template from which to generate the document",
    },
    data: {
      type: "object",
      label: "Data",
      description: "The object containing the variables for your PDF template",
      optional: true,
    },
    convertToImage: {
      type: "boolean",
      label: "Convert to Image",
      description: "Whether to convert the PDF to a PNG image",
      optional: true,
      default: false,
    },
    s3bucket: {
      type: "string",
      label: "S3 Bucket",
      description: "The ID of the active S3 connection to store the generated file on",
      optional: true,
    },
    s3key: {
      type: "string",
      label: "S3 Key",
      description: "The path and filename without extension for saving the file in the S3 bucket",
      optional: true,
    },
    webhook: {
      type: "string",
      label: "Webhook URL",
      description: "The URL of your webhook endpoint",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML content you want to render as PDF",
    },
    pdfParams: {
      type: "object",
      label: "PDF Parameters",
      description: "PDF parameters to customize the output",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pdforge.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.apiToken}`,
        },
      });
    },
    async generateDocumentFromTemplate(opts = {}) {
      const {
        templateId, data, convertToImage, s3bucket, s3key, webhook,
      } = opts;
      const path = webhook
        ? "/pdf/async"
        : "/pdf/sync";
      return this._makeRequest({
        path,
        data: {
          templateId,
          data,
          convertToImage,
          s3_bucket: s3bucket,
          s3_key: s3key,
          webhook,
        },
      });
    },
    async generatePDFfromHTML(opts = {}) {
      const {
        html, pdfParams, convertToImage, s3bucket, s3key, webhook,
      } = opts;
      const path = webhook
        ? "/html-to-pdf/async"
        : "/html-to-pdf/sync";
      return this._makeRequest({
        path,
        data: {
          html,
          pdfParams,
          convertToImage,
          s3_bucket: s3bucket,
          s3_key: s3key,
          webhook,
        },
      });
    },
  },
};
