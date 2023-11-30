import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shoprocket",
  propDefinitions: {
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email of the customer",
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The unique identifier for the order",
    },
    orderedProducts: {
      type: "string[]",
      label: "Ordered Products",
      description: "A list of ordered product IDs",
      optional: true,
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The unique identifier for the product",
    },
    productName: {
      type: "string",
      label: "Product Name",
      description: "The name of the product",
    },
    productPrice: {
      type: "string",
      label: "Product Price",
      description: "The price of the product",
      optional: true,
    },
    productStockQuantity: {
      type: "integer",
      label: "Stock Quantity",
      description: "The quantity of the product in stock",
      optional: true,
    },
    productDescription: {
      type: "string",
      label: "Product Description",
      description: "A description of the product",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.shoprocket.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
        data,
        params,
      });
    },
    async createCustomer(customerData) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: customerData,
      });
    },
    async createOrder(orderData) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        data: orderData,
      });
    },
    async createProduct(productData) {
      return this._makeRequest({
        method: "POST",
        path: "/products",
        data: productData,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
