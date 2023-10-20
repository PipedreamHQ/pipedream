import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import constants from "../actions/common/constants";

export default defineApp({
  type: "app",
  app: "wildberries",
  propDefinitions: {
    orderId: {
      type: "integer",
      label: "Order id",
      description: "Set the Order Id.",
    },
    orderIds: {
      type: "integer[]",
      label: "Order ids",
      description: "Array of order ids.\n\n**Example:**`[8423848, 6436344]`",
    },
    status: {
      label: "Status",
      type: "string",
      description: "Set the new status of the order.",
      options: constants.ORDER_STATUSES,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://suppliers-api.wildberries.ru/api/v2";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _getRequestParams(opts) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async listOrders($ = this, params) {
      const response = await axios($, this._getRequestParams({
        method: "GET",
        path: "/orders",
        params: this.filterEmptyValues(params),
      }));
      return response;
    },
    async updateOrderStatus($ = this, params) {
      const response = await axios($, this._getRequestParams({
        method: "PUT",
        path: "/orders",
        data: [
          this.filterEmptyValues(params),
        ],
      }));
      return response;
    },
    async listOrderStickers($ = this, params, asPdf) {
      let path = "/orders/stickers";
      if (asPdf) {
        path += "/pdf";
      }
      const response = await axios($, this._getRequestParams({
        method: "POST",
        path,
        data: this.filterEmptyValues(params),
      }));
      return response;
    },
    filterEmptyValues(obj) {
      return Object.entries(obj)
        .reduce((reduction,
          [
            key,
            value,
          ]) => {
          if (value === undefined || value === null) {
            return reduction;
          }
          return {
            ...reduction,
            [key]: value,
          };
        }, {});
    },
  },
});
