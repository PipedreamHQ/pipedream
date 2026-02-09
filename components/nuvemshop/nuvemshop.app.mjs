import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "nuvemshop",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order",
      async options({ page }) {
        const orders = await this.listOrders({
          params: {
            page: page + 1,
            per_page: constants.DEFAULT_LIMIT,
          },
        });
        return orders?.map(({
          id, number,
        }) => ({
          value: id,
          label: `Order #${number}`,
        })) || [];
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
      async options({ page }) {
        const products = await this.listProducts({
          params: {
            page: page + 1,
            per_page: constants.DEFAULT_LIMIT,
          },
        });
        return products?.map(({
          id, name,
        }) => ({
          value: id,
          label: name?.es || name?.pt || name?.en || `Product ${id}`,
        })) || [];
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category",
      async options({ page }) {
        const categories = await this.listCategories({
          params: {
            page: page + 1,
            per_page: constants.DEFAULT_LIMIT,
          },
        });
        return categories?.map(({
          id, name,
        }) => ({
          value: id,
          label: name?.es || name?.pt || name?.en || `Category ${id}`,
        })) || [];
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}/${this.$auth.user_id}${path}`;
    },
    getHeaders(headers) {
      return {
        "Authentication": this.$auth.oauth_access_token,
        "Content-Type": "application/json",
        "User-Agent": "Pipedream (support@pipedream.com)",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        path: "/categories",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params = {},
      max,
    }) {
      params = {
        ...params,
        page: 1,
        per_page: constants.DEFAULT_LIMIT,
      };
      let total, count = 0;
      do {
        const data = await resourceFn({
          params,
        });
        const items = Array.isArray(data)
          ? data
          : data.data || [];
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        total = items?.length;
        params.page++;
      } while (total === params.per_page);
    },
  },
};
