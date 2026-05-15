import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "corporate_merch",
  propDefinitions: {},
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
