import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dingconnect",
  propDefinitions: {
    skuCode: {
      type: "string",
      label: "SKU Code",
      description: "The unique identifier for the product",
      async options() {
        const response = await this.getProducts({});
        const products = response.Items;
        return products.map(({ SkuCode }) => ({
          value: SkuCode,
        }));
      },
    },
    sendValue: {
      type: "string",
      label: "Send Value",
      description: "The monetary value to send, i.e `10.5`",
    },
    batchItemRef: {
      type: "string",
      label: "Item Reference",
      description: "A unique reference for an item",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.dingconnect.com/api/V1";
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
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getProducts(args = {}) {
      return this._makeRequest({
        path: "/GetProducts",
        ...args,
      });
    },
    async estimatePrices(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/EstimatePrices",
        ...args,
      });
    },
    async getBalance(args = {}) {
      return this._makeRequest({
        path: "/GetBalance",
        ...args,
      });
    },
  },
};
