import WooCommerceAPI from "woocommerce-api";

export default {
  type: "app",
  app: "woocommerce",
  propDefinitions: {
    orderStatus: {
      type: "string",
      label: "Status",
      description: "Order Status",
      options: [
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "trash",
      ],
      optional: true,
      default: "pending",
    },
    customer: {
      type: "integer",
      label: "Customer",
      description: "User ID who owns the order. 0 for guests",
      async options({ page }) {
        const customers = await this.listCustomers(page + 1);
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
      reloadProps: true,
    },
  },
  methods: {
    async getClient() {
      return new WooCommerceAPI({
        url: `https://${this.$auth.url}`,
        consumerKey: this.$auth.key,
        consumerSecret: this.$auth.secret,
        wpAPI: true,
        version: "wc/v3",
      });
    },
    async listResources(endpoint) {
      const client = await this.getClient();
      return JSON.parse((await client.getAsync(endpoint)).body);
    },
    async postResource(endpoint, data) {
      const client = await this.getClient();
      return JSON.parse((await client.postAsync(endpoint, data)).body);
    },
    async listCustomers(page) {
      return this.listResources(`customers?page=${page}`);
    },
    async listPaymentGateways() {
      return this.listResources("payment_gateways");
    },
    async listProducts(page) {
      return this.listResources(`products?page=${page}`);
    },
    async createOrder(data) {
      return this.postResource("orders", data);
    },
  },
};
