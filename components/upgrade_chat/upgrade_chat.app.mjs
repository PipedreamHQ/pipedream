import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "upgrade_chat",
  propDefinitions: {
    orderUuid: {
      type: "string",
      label: "Order UUID",
      description: "The UUID of an order",
      async options({ page }) {
        const { data: orders } = await this.listOrders({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return orders.map((order) => ({
          label: `Order ID: ${order.uuid}`,
          value: order.uuid,
        }));
      },
    },
    productUuid: {
      type: "string",
      label: "Product UUID",
      description: "The UUID of a product",
      async options({ page }) {
        const { data: products } = await this.listProducts({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return products.map((product) => ({
          label: product.name,
          value: product.uuid,
        }));
      },
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return",
      default: DEFAULT_LIMIT,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of results to skip",
      default: 0,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.upgrade.chat/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    getOrder({
      orderUuid, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderUuid}`,
        ...opts,
      });
    },
    getProduct({
      productUuid, ...opts
    }) {
      return this._makeRequest({
        path: `/products/${productUuid}`,
        ...opts,
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
    async *paginate({
      fn, params, max,
    }) {
      params = {
        ...params,
        limit: DEFAULT_LIMIT,
        offset: 0,
      };
      let count = 0, done = false;
      do {
        const {
          data, has_more: hasMore,
        } = await fn(params);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        done = !hasMore;
        params.offset += DEFAULT_LIMIT;
      } while (!done);
    },
  },
};
