import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "oto",
  propDefinitions: {
    brandName: {
      type: "string",
      label: "Brand Name",
      description: "The brand name associated with the shipment",
      optional: true,
      async options() {
        const { clientStores } = await this.listBrands();
        return clientStores?.map(({ storeName }) => storeName) || [];
      },
    },
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "The brand ID of the product",
      optional: true,
      async options() {
        const { clientStores } = await this.listBrands();
        return clientStores?.map(({
          ID: value, storeName: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of an order",
      async options({ page }) {
        const { orders } = await this.listOrders({
          params: {
            page,
          },
        });
        return orders?.map(({ orderId }) => orderId ) || [];
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of an order",
      options: constants.STATUSES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/rest/v2`;
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhook",
        ...opts,
      });
    },
    getOrderDetails(opts = {}) {
      return this._makeRequest({
        path: "/orderDetails",
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    listBrands(opts = {}) {
      return this._makeRequest({
        path: "/getBrandList",
        ...opts,
      });
    },
    createProduct(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createProduct",
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          perPage: constants.DEFAULT_LIMIT,
          page: 1,
        },
      };
      let total, count = 0;
      do {
        const response = await fn(args);
        const items = response[resourceKey] ?? [];
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = items.length;
        args.params.page++;
      } while (total === args.params.perPage);
    },
  },
};
