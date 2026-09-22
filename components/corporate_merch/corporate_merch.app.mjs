import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "corporate_merch",
  propDefinitions: {
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return per page. Must be ≤ 50. Defaults to `15`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return for pagination.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.corporatemerch.com/v2";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    createOrder({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/orders",
        data,
      });
    },
    listProducts({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/designs",
        params,
      });
    },
    listOrders({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/orders",
        params,
      });
    },
    listContacts({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/contacts",
        params,
      });
    },
    createContact({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/contacts",
        data,
      });
    },
    listPrivateLinks({
      $, redeemPageId, params,
    }) {
      return this._makeRequest({
        $,
        path: `/redeem-pages/${redeemPageId}/private-links`,
        params,
      });
    },
    listRedeemPages({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/redeem-pages",
        params,
      });
    },
    createPrivateLink({
      $, redeemPageId, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/redeem-pages/${redeemPageId}/private-links`,
        data,
      });
    },
  },
};
