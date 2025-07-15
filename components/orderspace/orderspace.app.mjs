import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "orderspace",
  propDefinitions: {
    paymentTermId: {
      type: "string",
      label: "Payment Term ID",
      description: "The ID of a payment term",
      optional: true,
      async options() {
        const { payment_terms = [] } = await this.listPaymentTerms();
        return payment_terms.map((term) => ({
          label: term.name,
          value: term.id,
        }));
      },
    },
    customerGroupId: {
      type: "string",
      label: "Customer Group ID",
      description: "The ID of a customer group",
      optional: true,
      async options() {
        const { customer_groups = [] } = await this.listCustomerGroups();
        return customer_groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
    priceListId: {
      type: "string",
      label: "Price List ID",
      description: "The ID of a price list",
      optional: true,
      async options() {
        const { price_lists = [] } = await this.listPriceLists();
        return price_lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of an order",
      async options({ prevContext }) {
        const { orders = [] } = await this.listOrders({
          params: {
            starting_after: prevContext?.after,
          },
        });
        return {
          options: orders.map((order) => order.id),
          context: {
            after: orders.length
              ? orders[orders.length - 1].id
              : undefined,
          },
        };
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of a customer",
      async options({ prevContext }) {
        const { customers = [] } = await this.listCustomers({
          params: {
            starting_after: prevContext?.after,
          },
        });
        return {
          options: customers.map((customer) => ({
            label: customer.company_name,
            value: customer.id,
          })),
          context: {
            after: customers.length
              ? customers[customers.length - 1].id
              : undefined,
          },
        };
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of a product",
      async options({ prevContext }) {
        const { products = [] } = await this.listProducts({
          params: {
            starting_after: prevContext?.after,
          },
        });
        return {
          options: products.map((product) => ({
            label: product.name,
            value: product.id,
          })),
          context: {
            after: products.length
              ? products[products.length - 1].id
              : undefined,
          },
        };
      },
    },
    productSku: {
      type: "string",
      label: "Product SKU",
      description: "The SKU of a product",
      async options({ productId }) {
        const { product: { product_variants = [] } } = await this.getProduct({
          productId,
        });
        return product_variants.map((variant) => variant.sku);
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of a category",
      optional: true,
      async options({ prevContext }) {
        const { categories = [] } = await this.listCategories({
          params: {
            starting_after: prevContext?.after,
          },
        });
        return {
          options: categories.map((category) => ({
            label: category.name,
            value: category.id,
          })),
          context: {
            after: categories.length
              ? categories[categories.length - 1].id
              : undefined,
          },
        };
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. The default is `50` and the maximum limit is `200`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.orderspace.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    getProduct({
      productId, ...opts
    }) {
      return this._makeRequest({
        path: `/products/${productId}`,
        ...opts,
      });
    },
    listPaymentTerms(opts = {}) {
      return this._makeRequest({
        path: "/payment_terms",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listCustomerGroups(opts = {}) {
      return this._makeRequest({
        path: "/customer_groups",
        ...opts,
      });
    },
    listPriceLists(opts = {}) {
      return this._makeRequest({
        path: "/price_lists",
        ...opts,
      });
    },
    listOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        path: "/categories",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        ...opts,
      });
    },
    createDispatch(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/dispatches",
        ...opts,
      });
    },
    updateInventoryLevel(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/inventory_levels",
        ...opts,
      });
    },
  },
};
