import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

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
      async options({
        page, prevContext: { hasMore },
        mapper = ({
          id: value, name: label,
        }) => ({
          label,
          value,
        }),
      }) {
        if (hasMore === false) {
          return [];
        }
        const {
          data,
          meta: {
            pagination: {
              total,
              count,
            },
          },
        } = await this.getAllProducts({
          params: {
            page,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        const options = data.map(mapper);
        return {
          options,
          context: {
            hasMore: count < total,
          },
        };
      },
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
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The image URL to upload. 255 character limit. Supported image file types are BMP, GIF, JPEG, PNG, WBMP, XBM, and WEBP. Each image uploaded by URL can be up to 8 MB.",
      optional: true,
    },
    imageFile: {
      type: "string",
      label: "Product Image File",
      description: "The local path to the original image file previously downloaded to Pipedream E.g. (`/tmp/my-image.png`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory). Supported image file types are BMP, GIF, JPEG, PNG, WBMP, XBM, and WEBP. Each image file can be up to 8 MB.",
      optional: true,
    },
  },
  methods: {
    getHeaders() {
      return {
        "X-Auth-Token": `${this.$auth.access_token}`,
      };
    },
    getUrl(path, version = "v3") {
      return `${constants.BASE_URL}/${this.$auth.store_hash}/${version}${path}`;
    },
    getFormDataConfig({
      headers, data: preData, ...args
    } = {}) {
      const contentType = constants.CONTENT_TYPE_KEY_HEADER;
      const hasMultipartHeader = utils.hasMultipartHeader(headers);
      const data = hasMultipartHeader && utils.getFormData(preData) || preData;
      const currentHeaders = this.getHeaders(headers);

      return {
        headers: hasMultipartHeader
          ? {
            ...currentHeaders,
            [contentType]: data.getHeaders()[contentType.toLowerCase()],
          }
          : currentHeaders,
        data,
        ...args,
      };
    },
    _makeRequest({
      $ = this, path, version, ...args
    }) {
      const config = this.getFormDataConfig({
        debug: true,
        url: this.getUrl(path, version),
        ...args,
      });
      return axios($, config);
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
    getProduct({
      productId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/catalog/products/${productId}`,
        ...args,
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
    createProductImage({
      productId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/catalog/products/${productId}/images`,
        ...args,
      });
    },
  },
};
