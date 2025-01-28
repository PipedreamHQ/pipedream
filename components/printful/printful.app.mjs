import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "printful",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Event Filters
    orderStatusFilter: {
      type: "string",
      label: "Order Status Filter",
      description: "Filter events by specific order statuses",
      optional: true,
      async options() {
        const statuses = await this.listOrderStatuses();
        return statuses.map((status) => ({
          label: status.name,
          value: status.id,
        }));
      },
    },
    fulfillmentLocationFilter: {
      type: "string",
      label: "Fulfillment Location Filter",
      description: "Filter events by specific fulfillment locations",
      optional: true,
      async options() {
        const locations = await this.listFulfillmentLocations();
        return locations.map((location) => ({
          label: location.name,
          value: location.id,
        }));
      },
    },
    orderUpdateStatusFilter: {
      type: "string",
      label: "Order Update Status Filter",
      description: "Filter order updates by specific statuses",
      optional: true,
      async options() {
        const statuses = await this.listOrderStatuses();
        return statuses.map((status) => ({
          label: status.name,
          value: status.id,
        }));
      },
    },
    // Create Order Props
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "Name of the order recipient",
    },
    recipientAddress1: {
      type: "string",
      label: "Recipient Address Line 1",
      description: "First line of the recipient's address",
    },
    recipientAddress2: {
      type: "string",
      label: "Recipient Address Line 2",
      description: "Second line of the recipient's address",
      optional: true,
    },
    recipientCity: {
      type: "string",
      label: "Recipient City",
      description: "City of the recipient",
    },
    recipientState: {
      type: "string",
      label: "Recipient State/Province",
      description: "State or province of the recipient",
    },
    recipientZip: {
      type: "string",
      label: "Recipient ZIP/Postal Code",
      description: "ZIP or postal code of the recipient",
    },
    recipientCountry: {
      type: "string",
      label: "Recipient Country",
      description: "Country of the recipient",
    },
    shippingMethod: {
      type: "string",
      label: "Shipping Method",
      description: "Shipping method for the order",
      async options() {
        const shippingMethods = await this.getShippingMethods();
        return shippingMethods.map((method) => ({
          label: method.name,
          value: method.id,
        }));
      },
    },
    orderItems: {
      type: "string[]",
      label: "Order Items",
      description: "List of order items in JSON format",
    },
    orderNotes: {
      type: "string",
      label: "Order Notes",
      description: "Optional notes for the order",
      optional: true,
    },
    orderMetadata: {
      type: "string",
      label: "Order Metadata",
      description: "Optional metadata for the order in JSON format",
      optional: true,
    },
    // Fetch Shipping Rates Props
    shippingRecipientAddress: {
      type: "string",
      label: "Recipient Address",
      description: "Recipient address in JSON format",
    },
    shippingProductDetails: {
      type: "string[]",
      label: "Product Details",
      description: "Product details in JSON format",
    },
    // Update Product Props
    productId: {
      type: "string",
      label: "Product ID",
      description: "ID of the product to update",
    },
    updateFields: {
      type: "string",
      label: "Update Fields",
      description: "Fields to update in JSON format",
    },
  },
  methods: {
    // Log authentication keys
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL for Printful API
    _baseUrl() {
      return "https://api.printful.com";
    },
    // Make an API request using axios
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers = {},
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    // Fetch order statuses
    async listOrderStatuses(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/orders/statuses",
        ...opts,
      });
    },
    // Fetch fulfillment locations
    async listFulfillmentLocations(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/locations",
        ...opts,
      });
    },
    // Fetch shipping methods
    async getShippingMethods(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/shipping/rates",
        ...opts,
      });
    },
    // Create a new order
    async createOrder(opts = {}) {
      const {
        recipientName,
        recipientAddress1,
        recipientAddress2,
        recipientCity,
        recipientState,
        recipientZip,
        recipientCountry,
        shippingMethod,
        orderItems,
        orderNotes,
        orderMetadata,
        ...rest
      } = opts;

      const data = {
        recipient: {
          name: recipientName,
          address1: recipientAddress1,
          address2: recipientAddress2,
          city: recipientCity,
          state_code: recipientState,
          zip: recipientZip,
          country_code: recipientCountry,
        },
        shipping: shippingMethod,
        items: orderItems.map(JSON.parse),
      };

      if (orderNotes) data.notes = orderNotes;
      if (orderMetadata) data.metadata = JSON.parse(orderMetadata);

      return this._makeRequest({
        method: "POST",
        path: "/orders",
        data,
        ...rest,
      });
    },
    // Fetch available shipping rates
    async fetchShippingRates(opts = {}) {
      const {
        shippingRecipientAddress, shippingProductDetails, ...rest
      } = opts;

      const data = {
        recipient: JSON.parse(shippingRecipientAddress),
        items: shippingProductDetails.map(JSON.parse),
      };

      return this._makeRequest({
        method: "POST",
        path: "/shipping/rates",
        data,
        ...rest,
      });
    },
    // Update an existing product
    async updateProduct(opts = {}) {
      const {
        productId, updateFields, ...rest
      } = opts;
      const data = JSON.parse(updateFields);

      return this._makeRequest({
        method: "PUT",
        path: `/store/products/${productId}`,
        data,
        ...rest,
      });
    },
    // List orders with optional filters
    async listOrders(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/orders",
        params: opts.params,
        ...opts,
      });
    },
    // List products
    async listProducts(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/store/products",
        params: opts.params,
        ...opts,
      });
    },
    // Pagination method for listing endpoints
    async paginate(fn, ...opts) {
      const results = [];
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await fn({
          ...opts,
          params: {
            ...opts.params,
            page,
          },
        });
        if (response.length > 0) {
          results.push(...response);
          page += 1;
        } else {
          hasMore = false;
        }
      }

      return results;
    },
  },
};
