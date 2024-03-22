import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "loyverse",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Select a customer or provide a customer ID to retrieve information for. You can leave this empty to retrieve a list of customers instead.",
      optional: true,
      async options({ page }) {
        const customers = await this.getCustomers({
          params: {
            cursor: page,
          },
        });
        return customers.map(({
          id, name, email,
        }) => ({
          label: `${name} (${email})`,
          value: id,
        }));
      },
    },
    customerAmount: {
      type: "integer",
      label: "Max Amount",
      description: "The maximum amount of customers you want to retrieve, starting from the most recent customers. If you provide a `Customer ID`, this will be ignored.",
      optional: true,
      default: 50,
      min: 1,
      max: 250,
    },
    storeId: {
      type: "string",
      label: "Store ID",
      description: "The unique identifier for the store.",
      optional: false,
    },
    itemIds: {
      type: "string[]",
      label: "Item IDs",
      description: "List of item IDs.",
      optional: true,
    },
    paymentDetails: {
      type: "object",
      label: "Payment Details",
      description: "Payment details for the receipt.",
      optional: true,
    },
    variantQuantities: {
      type: "object[]",
      label: "Variant Quantities",
      description: "List of variant ids and corresponding quantity information.",
      optional: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.loyverse.com/v1.0";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createReceipt({
      storeId, itemIds = [], paymentDetails, customerId,
    }) {
      return this._makeRequest({
        method: "POST",
        url: "/receipts",
        data: {
          store_id: storeId,
          line_items: itemIds.map((id) => ({
            variant_id: id,
          })),
          payments: paymentDetails
            ? [
              paymentDetails,
            ]
            : [],
          customer_id: customerId,
        },
      });
    },
    async batchUpdateInventoryLevels({ variantQuantities }) {
      return this._makeRequest({
        method: "POST",
        url: "/inventory_levels/batch",
        data: {
          inventory_levels: variantQuantities.map(({
            variantId, quantity,
          }) => ({
            variant_id: variantId,
            in_stock: quantity,
          })),
        },
      });
    },
    async getCustomerDetails({
      customerId, ...args
    }) {
      return this._makeRequest({
        url: `/customers/${customerId}`,
        ...args,
      });
    },
    async listCustomers(args) {
      const response = await this._makeRequest({
        url: "/customers",
        ...args,
      });
      return response.customers;
    },
  },
};
