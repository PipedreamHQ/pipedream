import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "taggun",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "Image URL to process",
    },
    referenceId: {
      type: "string",
      label: "Reference ID",
      description: "Custom reference ID for tracking the request",
    },
    refresh: {
      type: "boolean",
      label: "Refresh",
      description: "Force reprocessing of the image instead of using cached results",
      optional: true,
    },
    near: {
      type: "string",
      label: "Near",
      description: "Provide a nearby location to improve result accuracy",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Preferred language for extracted text",
      options: constants.LANGUAGE_OPTIONS,
      optional: true,
    },
    incognito: {
      type: "boolean",
      label: "Incognito",
      description: "Do not store or use the image for system training",
      optional: true,
    },
    totalAmount: {
      type: "string",
      label: "Total Amount",
      description: "The expected total amount from the user",
      optional: true,
    },
    taxAmount: {
      type: "string",
      label: "Tax Amount",
      description: "The expected tax amount from the user",
      optional: true,
    },
    merchantName: {
      type: "string",
      label: "Merchant Name",
      description: "The expected merchant name from the user",
      optional: true,
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "The expected currency code from the user",
      optional: true,
    },
    verbose: {
      type: "boolean",
      label: "Verbose",
      description: "Whether the data extraction will be simple or verbose",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.taggun.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "apikey": `${this.$auth.api_key}`,
          "Content-Type": "application/json",
          ...headers,
        },
      });
    },
    async urlDataExtraction({
      verbose, ...args
    }) {
      return this._makeRequest({
        path: `/receipt/v1/${verbose
          ? "verbose"
          : "simple"}/url`,
        method: "post",
        ...args,
      });
    },
    async submitFeedback(args = {}) {
      return this._makeRequest({
        path: "/account/v1/feedback",
        method: "post",
        ...args,
      });
    },
  },
};
