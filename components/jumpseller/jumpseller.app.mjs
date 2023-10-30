import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jumpseller",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product",
      description: "Identifier of a product",
      async options({ page }) {
        const products = await this.listProducts({
          params: {
            page: page + 1,
          },
        });
        return products?.map(({ product }) => ({
          value: product.id,
          label: product.name,
        })) || [];
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the product.",
    },
    price: {
      type: "string",
      label: "Price",
      description: "The price of the product.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the product.",
      optional: true,
    },
    stock: {
      type: "integer",
      label: "Stock",
      description: "Quantity in stock for the product.",
      optional: true,
    },
    sku: {
      type: "integer",
      label: "SKU",
      description: "Stock Keeping Unit of the product.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the product",
      options: [
        "available",
        "not-available",
        "disabled",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.jumpseller.com/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/hooks.json",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      hookId, ...args
    }) {
      return this._makeRequest({
        path: `/hooks/${hookId}.json`,
        method: "DELETE",
        ...args,
      });
    },
    listProducts(args = {}) {
      return this._makeRequest({
        path: "/products.json",
        ...args,
      });
    },
    createProduct(args = {}) {
      return this._makeRequest({
        path: "/products.json",
        method: "POST",
        ...args,
      });
    },
    createProductVariant({
      productId, ...args
    }) {
      return this._makeRequest({
        path: `/products/${productId}/variants.json`,
        method: "POST",
        ...args,
      });
    },
    updateProduct({
      productId, ...args
    }) {
      return this._makeRequest({
        path: `/products/${productId}.json`,
        method: "PUT",
        ...args,
      });
    },
  },
};
