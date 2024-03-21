import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "loyverse",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer.",
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
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
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
        data,
        params,
      });
    },
    async createReceipt({
      storeId, itemIds = [], paymentDetails, customerId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/receipts",
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
        path: "/inventory_levels/batch",
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
    async getCustomerDetails({ customerId }) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
      });
    },
  },
};
