import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import constants from "../common/constants";

export default defineApp({
  type: "app",
  app: "apitemplate_io",
  propDefinitions: {
    apiEndpoints: {
      type: "string",
      label: "API Endpoints",
      description: "A regional API endpoint is intended for customers in the same region. The data for the request and generated PDFs/images are processed and stored within the region. [see docs](https://apitemplate.io/apiv2/#section/Regional-API-endpoint(s))",
      optional: true,
      options: constants.API_ENDPOINTS_OPTS,
    },
    exportType: {
      type: "string",
      label: "Export Type",
      description: "Either `file` or `json`(Default).",
      optional: true,
      options: constants.EXPORT_TYPE_OPTS,
    },
    transactionType: {
      type: "string",
      label: "Transaction Type",
      description: "Filtered by transaction type.",
      optional: true,
      options: constants.TRANSACTION_TYPE_OPTS,
    },
    outputHtml: {
      type: "boolean",
      label: "Output HTML",
      description: "Whether it should output html or not",
      optional: true,
    },
    isCmyk: {
      type: "boolean",
      label: "Is CMYK",
      description: "Use CMYK color profile, Default to `false`",
      optional: true,
    },
    async: {
      type: "boolean",
      label: "Async",
      description: "To generate PDF asynchronously, set the value to `true` and the API call returns immediately. Once the PDF document is generated, we will make a HTTP/HTTPS GET to your webhook and will retry for 3 times before giving up.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "It is the URL of your webhook URL, it starts with `http://` or `https://` and has to be urlencoded.",
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Default to UUID (e.g 0c93bd9e-9ebb-4634-a70f-de9131848416.pdf). Use this to specify custom file name, it should end with `.pdf`",
      optional: true,
    },
    imageResampleRes: {
      type: "integer",
      label: "Image Resample Res",
      description: "We embed the original images by default, meaning large PDF file sizes. Specifying this option helps reduce the PDF file size. Common values are `72`, `96`, `150`, `300` and `600`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Retrieve only the number of records specified. Default to 300.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Offset is used to skip the number of records from the results. Default to 0.",
      optional: true,
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "Either `pdf`(Default) or `html`.",
      optional: true,
      options: constants.OUTPUT_FORMAT_OPTS,
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "The ID of the template that you want to use.",
      async options({
        prevContext,
        format,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        let offset = 0;
        if (prevContext && Number.isInteger(prevContext.offset)) {
          offset = ((prevContext.offset / limit) + 1) * limit;
        }
        const params = {
          limit,
          offset,
          format,
        };
        return this.getTemplateOpts(params);
      },
    },
    transactionRef: {
      type: "string",
      label: "Transaction Ref",
      description: "Object transaction reference.",
      async options({ prevContext }) {
        const limit = constants.DEFAULT_LIMIT;
        let offset = 0;
        if (prevContext && Number.isInteger(prevContext.offset)) {
          offset = ((prevContext.offset / limit) + 1) * limit;
        }
        const params = {
          limit,
          offset,
        };
        return this.listObjectOpts(params);
      },
    },
    expiration: {
      type: "integer",
      label: "Expiration",
      description: "Expiration of the generated image in minutes(default to `0`, store permanently).",
      optional: true,
    },
    meta: {
      type: "string",
      label: "Meta",
      description: "Specify an external reference ID for your own reference. It appears in the `list-objects` API.",
      optional: true,
    },
    overrides: {
      type: "any",
      label: "Overrides",
      description: "Array of objects with the property name and the replaced values on the template, as shown below:\n\n`[{\"name\": \"text_name\",\"text\": \"My Name\"}, {\"name\": \"text_quote\",\"text\": \"Lorem ipsum dolor sit...\"}]`",
    },
    data: {
      type: "any",
      label: "Data",
      description: "Object to replace values on the template, you can [check here](https://app.apitemplate.io/manage-templates/) for the JSON example for your template.",
    },
  },
  methods: {
    _getUrl(api, path) {
      if (api) {
        return `${api}/v2${path}`;
      }
      return `https://rest.apitemplate.io/v2${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": this.$auth.api_key,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _getRequestParams(opts: any) {
      return {
        ...opts,
        url: this._getUrl(opts.api, opts.path),
        headers: this._getHeaders(),
      };
    },
    async getTemplates($ = this, params) {
      const response = await axios($, this._getRequestParams({
        method: "GET",
        path: "/list-templates",
        params,
      }));
      return response;
    },
    async getTemplateOpts(params) {
      const { templates } = await this.getTemplates(this, params);
      const options = templates.map((template) => ({
        label: template.name,
        value: template.template_id,
      }));
      return {
        context: {
          offset: params.offset,
        },
        options,
      };
    },
    async createImage($ = this, api, params, data) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        api,
        path: "/create-image",
        params,
        data,
      }));
      return response;
    },
    async listObjects($ = this, api, params) {
      const response = await axios($, this._getRequestParams({
        method: "GET",
        api,
        path: "/list-objects",
        params,
      }));
      return response;
    },
    async listObjectOpts(params) {
      const { objects } = await this.listObjects(this, null, params);
      const options = objects.filter((obj) => obj.deletion_status === 0)
        .map((obj) => ({
          label: obj.meta || obj.primary_url
            .split("/")
            .pop()
            .split("?")
            .shift(),
          value: obj.transaction_ref,
        }));
      return {
        context: {
          offset: params.offset,
        },
        options,
      };
    },
    async deleteObject($ = this, api, params) {
      const response = await axios($, this._getRequestParams({
        method: "GET",
        api,
        path: "/delete-object",
        params,
      }));
      return response;
    },
    async getAccountInformation($ = this, api) {
      const response = await axios($, this._getRequestParams({
        method: "GET",
        api,
        path: "/account-information",
      }));
      return response;
    },
  },
});
