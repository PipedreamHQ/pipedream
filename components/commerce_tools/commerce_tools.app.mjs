import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "commerce_tools",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The unique `id` of the Order. Run the **Query Orders** action first to look up an Order's `id`.",
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The `orderNumber` of the Order. Run the **Query Orders** action first to look up an Order's `orderNumber`.",
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "[Reference Expansion](https://docs.commercetools.com/api/general-concepts#reference-expansion) paths to expand in the response. For example, `customerGroup`.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of results to skip (for pagination).",
      min: 0,
      max: 10000,
      optional: true,
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _projectKey() {
      return this.$auth.project_key;
    },
    _baseUrl() {
      // The stored API URL is region-specific, e.g. https://api.{region}.commercetools.com
      return `${this.$auth.api_url.replace(/\/+$/, "")}/${this._projectKey()}`;
    },
    _params(params = {}) {
      // commercetools expects repeated query parameters (where=...&where=...),
      // not the bracketed array form (where[]=...) that axios serializes by default.
      const searchParams = new URLSearchParams();
      for (const [
        key,
        value,
      ] of Object.entries(params)) {
        if (value === undefined || value === null) {
          continue;
        }
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item));
        } else {
          searchParams.append(key, value);
        }
      }
      return searchParams;
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...(params && {
          params: this._params(params),
        }),
        ...opts,
      });
    },
    getOrderById({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${id}`,
        ...opts,
      });
    },
    getOrderByOrderNumber({
      orderNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/order-number=${encodeURIComponent(orderNumber)}`,
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    searchOrders(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders/search",
        ...opts,
      });
    },
    getProject(opts = {}) {
      // The base URL already targets the Project (`{api_url}/{projectKey}`).
      return this._makeRequest({
        path: "",
        ...opts,
      });
    },
    updateProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "",
        ...opts,
      });
    },
    reindexOrders(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders/indexer/graphql",
        data: {
          query: constants.REINDEX_ORDERS_MUTATION,
        },
        ...opts,
      });
    },
  },
};
