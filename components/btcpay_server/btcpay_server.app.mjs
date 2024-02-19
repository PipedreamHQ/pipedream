import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "btcpay_server",
  propDefinitions: {
    storeId: {
      type: "string",
      label: "Store ID",
      description: "Identifier of a store",
      async options() {
        const stores = await this.listStores();
        return stores?.map(({
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
      return `https://${this.$auth.base_url}/api/v1`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `token ${this.$auth.api_key}`,
        },
      });
    },
    listStores(opts = {}) {
      return this._makeRequest({
        path: "/stores",
        ...opts,
      });
    },
    createPaymentRequest({
      storeId, ...opts
    }) {
      return this._makeRequest({
        method: "post",
        path: `/stores/${storeId}/payment-requests`,
        ...opts,
      });
    },
    getStoreWalletBalance({
      storeId, cryptoCode, ...opts
    }) {
      return this._makeRequest({
        path: `/stores/${storeId}/payment-methods/onchain/${cryptoCode}/wallet`,
        ...opts,
      });
    },
  },
};
