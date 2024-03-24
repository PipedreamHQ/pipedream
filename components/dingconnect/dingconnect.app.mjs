import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dingconnect",
  propDefinitions: {
    skuCode: {
      type: "string",
      label: "SKU Code",
      description: "The unique identifier for the product",
    },
    sendValue: {
      type: "number",
      label: "Send Value",
      description: "The monetary value to send",
    },
    receiveValue: {
      type: "number",
      label: "Receive Value",
      description: "The expected monetary value to receive",
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "The account number to check balance for",
    },
    productProviderCode: {
      type: "string",
      label: "Provider Code",
      description: "The unique code for the provider.",
    },
    regionCode: {
      type: "string",
      label: "Region Code",
      description: "The unique code for the region.",
      optional: true,
    },
    customerReference: {
      type: "string",
      label: "Customer Reference",
      description: "Your customer reference for the transaction.",
      optional: true,
    },
    distributorRef: {
      type: "string",
      label: "Distributor Reference",
      description: "Your distributor reference for the transaction.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://www.dingconnect.com/api/V1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "api_key": `${this.$auth.api_key}`,
        },
      });
    },
    async getProducts(opts = {}) {
      return this._makeRequest({
        path: "/GetProducts",
        ...opts,
      });
    },
    async estimatePrices(opts = {}) {
      const {
        productProviderCode, sendValue, receiveValue, customerReference, distributorRef, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/EstimatePrices",
        data: {
          ProviderCode: productProviderCode,
          SendValue: sendValue,
          ReceiveValue: receiveValue,
          CustomerReference: customerReference,
          DistributorRef: distributorRef,
        },
        ...otherOpts,
      });
    },
    async getBalance(opts = {}) {
      return this._makeRequest({
        path: "/GetBalance",
        ...opts,
      });
    },
  },
  version: `0.0.${new Date().getTime()}`,
};
