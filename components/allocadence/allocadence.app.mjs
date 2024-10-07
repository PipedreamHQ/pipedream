import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "allocadence",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer who placed the order",
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
    },
    orderDetails: {
      type: "string",
      label: "Order Details",
      description: "Optional details about the customer order",
      optional: true,
    },
    deliveryMode: {
      type: "string",
      label: "Delivery Mode",
      description: "Optional delivery mode for the order",
      optional: true,
    },
    supplierId: {
      type: "string",
      label: "Supplier ID",
      description: "The ID of the supplier for purchase orders",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Optional quantity for the purchase order",
      optional: true,
    },
    deliveryDate: {
      type: "string",
      label: "Delivery Date",
      description: "Optional delivery date for the purchase order",
      optional: true,
    },
    customerInformation: {
      type: "string",
      label: "Customer Information",
      description: "Information about the customer",
    },
    productDetails: {
      type: "string",
      label: "Product Details",
      description: "Details about the product",
    },
    shippingAddress: {
      type: "string",
      label: "Shipping Address",
      description: "Address where the order will be shipped to",
    },
    specialInstructions: {
      type: "string",
      label: "Special Instructions",
      description: "Optional special instructions for the order",
      optional: true,
    },
    supplierDetails: {
      type: "string",
      label: "Supplier Details",
      description: "Details about the supplier",
    },
    deliveryAddress: {
      type: "string",
      label: "Delivery Address",
      description: "The address where the purchase order will be delivered",
    },
    orderDeadline: {
      type: "string",
      label: "Order Deadline",
      description: "Optional deadline for the order",
      optional: true,
    },
    additionalInstructions: {
      type: "string",
      label: "Additional Instructions",
      description: "Optional additional instructions for the purchase order",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.allocadence.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createCustomerOrder(opts = {}) {
      const {
        customerInformation, productDetails, shippingAddress, specialInstructions, ...extraOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/customer-orders",
        data: {
          customerInformation,
          productDetails,
          shippingAddress,
          specialInstructions,
          ...extraOpts,
        },
      });
    },
    async createPurchaseOrder(opts = {}) {
      const {
        supplierDetails, productDetails, deliveryAddress, orderDeadline, additionalInstructions, ...extraOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/purchase-orders",
        data: {
          supplierDetails,
          productDetails,
          deliveryAddress,
          orderDeadline,
          additionalInstructions,
          ...extraOpts,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
