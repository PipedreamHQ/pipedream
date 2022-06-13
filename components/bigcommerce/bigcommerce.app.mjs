import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bigcommerce",
  propDefinitions: {
    channel: {
      type: "boolean",
      label: "Using channel",
      description: "Channel of the webhook",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number to return",
      optional: true,
    },
    productId: {
      type: "integer",
      label: "Product Id",
      description: "The id of the product",
    },
    categoryId: {
      type: "integer",
      label: "Category Id",
      description: "The id of the category",
      async options({ page }) {
        const categories = await this.getAllCategories({
          page: page + 1,
        });
        return categories.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
  },
  methods: {
    _getHeaders() {
      return {
        "X-Auth-Token": `${this.$auth.access_token}`,
      };
    },
    _defaultConfig({
      path, version = "v3", ...otherConfig
    }) {
      const config = {
        url: `${constants.BASE_URL}/${this.$auth.store_hash}/${version}${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      };
      return config;
    },
    async _makeRequest({
      $, ...otherConfig
    }) {
      const config = this._defaultConfig({
        ...otherConfig,
      });

      return axios($ || this, config);
    },
    async *paginate({
      $, fn, params = {}, cursor,
    }) {
      const { limit } = params;
      let count = 0;

      do {
        const {
          data,
          meta,
        } = await fn({
          $,
          params: {
            ...params,
            cursor,
          },
        });

        for (const d of data) {
          yield d;

          if (limit && ++count === limit) {
            return count;
          }
        }

        cursor = meta.pagination.next;
      } while (cursor);
    },
    async deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${hookId}`,
      });
    },
    async createHook(
      webhookUrl,
      type,
      scope = "created",
      channel = null,
      channelId = null,
    ) {
      const channelScope = `${channel
        ? `channel/${channelId}/`
        : ""}`;

      const { data } = await this._makeRequest({
        method: "POST",
        path: "/hooks",
        data: {
          scope: `store/${channelScope}${type}/${scope}`,
          destination: webhookUrl,
          is_active: true,
        },
      });

      return data.id;
    },
    async getAllProducts({
      $, params,
    }) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: "/catalog/products",
        params,
      });
    },
    async getAllProductsSortOrder({
      $, params,
    }) {
      const {
        categoryId, ...qparams
      } = params;
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/catalog/categories/${categoryId}/products/sort-order`,
        params: qparams,
      });
    },
    async getProduct({
      $, productId,
    }) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/catalog/products/${productId}`,
      });
    },
    async getProductVariants({
      $, productId,
    }) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/catalog/products/${productId}/variants`,
      });
    },
    async createProduct({
      $, props,
    }) {
      return await this._makeRequest({
        $,
        method: "POST",
        path: "/catalog/products",
        data: props,
      });
    },
    async updateProduct({
      $, props,
    }) {
      const {
        productId, ...data
      } = props;
      return await this._makeRequest({
        $,
        method: "PUT",
        path: `/catalog/products/${productId}`,
        data,
      });
    },
    async deleteProduct({
      $, productId,
    }) {
      return await this._makeRequest({
        $,
        method: "DELETE",
        path: `/catalog/products/${productId}`,
      });
    },
    async getAllTaxClasses({
      $, page = 1, limit = 2,
    }) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/tax_classes?page=${page}&limit=${limit}`,
        version: "v2",
      });
    },
    async getAllCategories({
      $, page = 1, limit = 100,
    }) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/categories?page=${page}&limit=${limit}`,
        version: "v2",
      });
    },
    async getAllBrands({
      $, page = 1, limit = 50,
    }) {
      return await this._makeRequest({
        $,
        method: "GET",
        path: `/catalog/brands?page=${page}&limit=${limit}`,
      });
    },
  },
};
