import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "coupontools",
  propDefinitions: {
    couponId: {
      type: "string",
      label: "Coupon ID",
      description: "The ID of a coupon campaign",
      async options() {
        const { coupon_info: coupons } = await this.listCoupons();
        return coupons?.map(({
          ID: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    directoryId: {
      type: "string",
      label: "Directory ID",
      description: "The ID of a directory",
      async options() {
        const directories = await this.listDirectories();
        return directories?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.coupontools.com";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": `${this.$auth.client_id}`,
          "X-Client-Secret": `${this.$auth.client_secret}`,
        },
        ...opts,
      });
    },
    getCoupon(opts = {}) {
      return this._makeRequest({
        path: "/v3/coupon/info",
        ...opts,
      });
    },
    listCoupons(opts = {}) {
      return this._makeRequest({
        path: "/v3/coupon/list",
        ...opts,
      });
    },
    listDirectories(opts = {}) {
      return this._makeRequest({
        path: "/v4/directory",
        ...opts,
      });
    },
    listUsers({
      directoryId, ...opts
    }) {
      return this._makeRequest({
        path: `/v4/directory/${directoryId}/users`,
        ...opts,
      });
    },
    listSessions({
      type, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v3/campaign/${type}`,
        ...opts,
      });
    },
    createSingleUseURL(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v3/singleuse/create",
        ...opts,
      });
    },
    createSubaccount(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v4/subaccount/create",
        ...opts,
      });
    },
    sendCouponByEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v3/send/email",
        ...opts,
      });
    },
  },
};
