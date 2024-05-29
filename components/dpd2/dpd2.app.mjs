import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dpd2",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product being purchased",
      async options() {
        const { data } = await this.getProducts();
        return data.map((product) => ({
          label: product.name,
          value: product.id,
        }));
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.dpd2.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getProducts() {
      return this._makeRequest({
        path: "/products",
      });
    },
    async emitPurchaseEvent(productId) {
      return this._makeRequest({
        method: "POST",
        path: `/purchases/${productId}`,
        data: {
          productId: productId,
        },
      });
    },
  },
};
