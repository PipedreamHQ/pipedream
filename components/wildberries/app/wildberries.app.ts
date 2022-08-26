import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "wildberries",
  propDefinitions: {},
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
