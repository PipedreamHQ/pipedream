import { axios } from "@pipedream/platform";
import {
  LISTING_CONDITION,
  ORDER_STATUSES,
  SLEEVE_CONDITION,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "discogs",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "Select the order to update.",
      async options({ page }) {
        const { orders } = await this.listOrders({
          params: {
            page: page + 1,
          },
        });

        return orders.map(({
          id: value, status,
        }) => ({
          label: `Order ${value} (${status})`,
          value,
        }));
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the Order you are updating.",
      options: ORDER_STATUSES,
    },
    listingCondition: {
      type: "string",
      label: "Condition",
      description: "Select the condition of the item.",
      options: LISTING_CONDITION,
    },
    sleeveCondition: {
      type: "string",
      label: "Sleeve Condition",
      description: "Select the condition of the sleeve.",
      options: SLEEVE_CONDITION,
    },
    listingStatus: {
      type: "string",
      label: "Listing Status",
      description: "The status of the listing.",
      options: [
        "For Sale",
        "Draft",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.discogs.com/";
    },
    _getHeaders() {
      return {
        "Authorization": `Discogs token=${this.$auth.personal_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...args,
      });
    },
    listOrders(args = {}) {
      return this._makeRequest({
        path: "marketplace/orders",
        ...args,
      });
    },
    updateOrderStatus({
      orderId, status,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `marketplace/orders/${orderId}`,
        data: {
          status,
        },
      });
    },
    createListing(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "marketplace/listings",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          orders,
          pagination: {
            pages, page: currentPage,
          },
        } = await fn({
          params,
        });
        for (const d of orders) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = currentPage < pages;

      } while (hasMore);
    },
  },
};
