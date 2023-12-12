import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wp_maps",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product",
      description: "Identifier of a product",
      async options() {
        const { data } = await this.listProducts();
        return data?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the product",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the product",
    },
    price: {
      type: "string",
      label: "Price",
      description: "Price of the product",
    },
    image: {
      type: "string",
      label: "Image",
      description: "The URL of the product image",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The product URL",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://svr.wpmaps.net/v1";
    },
    _authParams(params) {
      return {
        ...params,
        client_id: `${this.$auth.client_id}`,
        access_token: `${this.$auth.access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    listProducts(args = {}) {
      return this._makeRequest({
        path: "/products/all",
        ...args,
      });
    },
    listStores(args = {}) {
      return this._makeRequest({
        path: "/stores/all",
        ...args,
      });
    },
    createOrUpdateProduct(args = {}) {
      return this._makeRequest({
        path: "/products/save",
        method: "POST",
        ...args,
      });
    },
  },
};
