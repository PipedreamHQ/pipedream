import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import querystring from "querystring";
import constants from "./constants.mjs";

export default {
  type: "app",
  app: "woocommerce",
  propDefinitions: {
    orderStatus: {
      type: "string",
      label: "Status",
      description: "Order Status",
      options: constants.orderStatuses,
      optional: true,
      default: "pending",
    },
    productStatus: {
      type: "string",
      label: "Status",
      description: "Product status. Default is publish",
      options: constants.productStatuses,
      optional: true,
      default: "publish",
    },
    role: {
      type: "string",
      label: "Role",
      description: "Limit result set to resources with a specific role",
      options: constants.roles,
      optional: true,
      default: "customer",
    },
    topics: {
      type: "string[]",
      label: "Event topics",
      description: "Types of events to watch for",
      options: constants.topics,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Limit results to those matching a string",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Limit result set to resources with a specific email",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return",
      optional: true,
      default: 20,
    },
    productName: {
      type: "string",
      label: "Name",
      description: "Name of the product",
    },
    productType: {
      type: "string",
      label: "Type",
      description: "Product type. Default is simple",
      options: constants.productTypes,
      optional: true,
      default: "simple",
    },
    regularPrice: {
      type: "string",
      label: "Regular Price",
      description: "Product regular price",
      optional: true,
    },
    salePrice: {
      type: "string",
      label: "Sale Price",
      description: "Product sale price",
      optional: true,
    },
    productDescription: {
      type: "string",
      label: "Description",
      description: "Description of the product",
      optional: true,
    },
    productImage: {
      type: "string",
      label: "Image URL",
      description: "URL of image to add to product",
      optional: true,
    },
    customer: {
      type: "integer",
      label: "Customer",
      description: "User ID who owns the order. 0 for guests",
      async options({ page }) {
        const customers = await this.listCustomers({
          page: page + 1,
        });
        return customers.map((customer) => ({
          label: customer.username,
          value: customer.id,
        }));
      },
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Method of payment for the order",
      async options() {
        const methods = await this.listPaymentGateways();
        return methods.map((method) => ({
          label: method.title,
          value: method.id,
        }));
      },
    },
    products: {
      type: "string[]",
      label: "Products",
      description: "Products to add to the the new order",
      async options({ page }) {
        const products = await this.listProducts(page + 1);
        return products.map((product) => ({
          label: product.name,
          value: product.id,
        }));
      },
      withLabel: true,
    },
    productCategories: {
      type: "string[]",
      label: "Categories",
      description: "Categories to add new product to",
      async options({ page }) {
        const categories = await this.listCategories(page + 1);
        return categories.map((category) => ({
          label: category.name,
          value: category.id,
        }));
      },
      optional: true,
    },
  },
  methods: {
    async getClient() {
      let url = this.$auth.url;

      if (!/^(http(s?):\/\/)/.test(url)) {
        url = `https://${url}`;
      }

      return new WooCommerceRestApi.default({
        url,
        consumerKey: this.$auth.key,
        consumerSecret: this.$auth.secret,
        wpAPI: true,
        version: "wc/v3",
      });
    },
    async listResources(endpoint) {
      const client = await this.getClient();
      return (await client.get(endpoint)).data;
    },
    async postResource(endpoint, data) {
      const client = await this.getClient();
      return (await client.post(endpoint, data)).data;
    },
    async putResource(endpoint, data) {
      const client = await this.getClient();
      return (await client.put(endpoint, data)).data;
    },
    async deleteResource(endpoint) {
      const client = await this.getClient();
      return (await client.delete(endpoint)).data;
    },
    async createWebhook(data) {
      return this.postResource("webhooks", data);
    },
    async deleteWebhook(id) {
      return this.deleteResource(`webhooks/${id}`);
    },
    async listCustomers(params) {
      const q = querystring.stringify(params);
      return this.listResources(`customers?${q}`);
    },
    async listPaymentGateways() {
      return this.listResources("payment_gateways");
    },
    async listProducts(page) {
      return this.listResources(`products?page=${page}`);
    },
    async listCategories(page) {
      return this.listResources(`products/categories?page=${page}`);
    },
    async createOrder(data) {
      return this.postResource("orders", data);
    },
    async createProduct(data) {
      return this.postResource("products", data);
    },
    async updateProduct(productId, data) {
      return this.putResource(`products/${productId}`, data);
    },
  },
};
