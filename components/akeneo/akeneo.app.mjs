import { axios } from "@pipedream/platform";

const PAGE_SIZE = 25;

export default {
  type: "app",
  app: "akeneo",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product Identifier",
      description: "An ID identifying the product - either this prop or `Product Model Code` should be set.",
      optional: true,
      async options({ page }) {
        page++;
        const resp = await this.getProducts({
          params: {
            limit: PAGE_SIZE,
            page,
          },
        });
        return resp?._embedded?.items?.map((product) => ({
          label: `${product.family} - ${product.uuid}`,
          value: product.identifier,
        })) || [];
      },
    },
    productModelCode: {
      type: "string",
      label: "Product Model Code",
      description: "A code identifying the product model - either this prop or `Product Identifier` should be set.",
      optional: true,
      async options({ page }) {
        page++;
        const resp = await this.getProductModels({
          params: {
            limit: PAGE_SIZE,
            page,
          },
        });
        return resp?._embedded?.items?.map((model) => model.code) || [];
      },
    },
    mediaFileAttributeCode: {
      type: "string",
      label: "Attribute Code",
      description: "A code identifying the attribute",
      async options({ page }) {
        page++;
        const resp = await this.getAttributes({
          params: {
            limit: PAGE_SIZE,
            page,
            search: {
              type: [
                {
                  operator: "IN",
                  value: [
                    "pim_catalog_image",
                  ],
                },
              ],
            },
          },
        });
        return resp?._embedded?.items?.map((attribute) => attribute.code) || [];
      },
    },
    channelCode: {
      type: "string",
      label: "Channel Code",
      description: "A code identifying the channel",
      async options({ page }) {
        page++;
        const resp = await this.getChannels({
          params: {
            limit: PAGE_SIZE,
            page,
          },
        });
        return resp?._embedded?.items?.map((channel) => channel.code) || [];
      },
    },
    localeCode: {
      type: "string",
      label: "Locale Code",
      description: "A code identifying the locale",
      async options({ channelCode }) {
        const resp = await this.getChannel({
          channelCode,
        });
        return resp?.locale || [];
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
      return axios($, config);
    },
    async getProducts(args = {}) {
      return this._makeRequest({
        path: "/products",
        ...args,
      });
    },
    async getAttributes(args = {}) {
      return this._makeRequest({
        path: "/attributes",
        ...args,
      });
    },
    async getAttribute({
      attributeCode,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/attributes/${attributeCode}`,
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
