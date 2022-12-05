import { axios } from "@pipedream/platform";
import {
  pageSize, attributeTypes,
} from "./common/constants.mjs"

export default {
  type: "app",
  app: "akeneo",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product Identifier",
      description: "An ID identifying the product. - Either this prop or `Product Model Code` should be set.",
      optional: true,
      async options({ page }) {
        page++;
        const resp = await this.getProducts({
          params: {
            limit: pageSize,
            page,
          },
        });
        return resp?._embedded?.items?.map((product) => ({
          label: product.uuid,
          value: product.identifier,
        }));
      },
    },
    productModelCode: {
      type: "string",
      label: "Product Model Code",
      description: "A code identifying the product model. - Either this prop or `Product Identifier` should be set.",
      optional: true,
      async options({ page }) {
        page++;
        const resp = await this.getProductModels({
          params: {
            limit: pageSize,
            page,
          },
        });
        return resp?._embedded?.items?.map((model) => model.code);
      },
    },
    attributeCode: {
      type: "string",
      label: "Attribute Code",
      description: "A code identifying the attribute",
      options: attributeTypes,
    },
    channelCode: {
      type: "string",
      label: "Channel Code",
      description: "A code identifying the channel",
      async options({ page }) {
        page++;
        const resp = await this.getChannels({
          params: {
            limit: pageSize,
            page,
          },
        });
        return resp?._embedded?.items?.map((channel) => channel.code);
      },
    },
    localeCode: {
      type: "string",
      label: "Locale Code",
      description: "A code identifying the locale",
      async options({ channelCode }) {
        const resp = await this.getChannel({ channelCode });
        return resp?.locales;
      },
    },
  },
  methods: {
    _getUrl(path) {
      return `https://${this.$auth.host}/api/rest/v1${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      console.log("axios config", config);
      return axios($, config);
    },
    async getProducts(args = {}) {
      return this._makeRequest({
        path: "/products",
        ...args,
      });
    },
    async getProductModels(args = {}) {
      return this._makeRequest({
        path: "/product-models",
        ...args,
      });
    },
    async getChannels(args = {}) {
      return this._makeRequest({
        path: "/channels",
        ...args,
      });
    },
    async getChannel({
      channelCode, ...args
    } = {}) {
      return this._makeRequest({
        path: `/channels/${channelCode}`,
        ...args,
      });
    },
    async createProductMediaFile(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/media-files",
        ...args,
      });
    },
  },
};
