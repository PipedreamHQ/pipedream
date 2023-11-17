import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shipday",
  propDefinitions: {
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "Alphanumeric identifier for the order object",
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer",
    },
    customerAddress: {
      type: "string",
      label: "Customer Address",
      description: "The address of the customer",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email address of the customer",
    },
    customerPhoneNumber: {
      type: "string",
      label: "Customer Phone Number",
      description: "Phone number of the customer with country code",
    },
    restaurantName: {
      type: "string",
      label: "Restaurant Name",
      description: "The name of the restaurant",
    },
    restaurantAddress: {
      type: "string",
      label: "Restaurant Address",
      description: "The address of the restaurant",
    },
    expectedDeliveryDate: {
      type: "string",
      label: "Expected Delivery Date",
      description: "Expected delivery date in UTC for the particular order ( yyyy-mm-dd format)",
      optional: true,
    },
    expectedPickupTime: {
      type: "string",
      label: "Expected Pickup Time",
      description: "Expected pickup time in UTC for the particular order (format hh:mm:ss)",
      optional: true,
    },
    expectedDeliveryTime: {
      type: "string",
      label: "Expected Delivery Time",
      description: "Expected Delivery Time in UTC for the particular order (format hh:mm:ss)",
      optional: true,
    },
    pickupLatitude: {
      type: "string",
      label: "Pickup Latitude",
      description: "The latitude of the pickup location",
      optional: true,
    },
    pickupLongitude: {
      type: "string",
      label: "Pickup Longitude",
      description: "The longitude of the pickup location",
      optional: true,
    },
    deliveryLatitude: {
      type: "string",
      label: "Delivery Latitude",
      description: "The latitude of the delivery location",
      optional: true,
    },
    deliveryLongitude: {
      type: "string",
      label: "Delivery Longitude",
      description: "The longitude of the delivery location",
      optional: true,
    },
    tips: {
      type: "string",
      label: "Tips",
      description: "Tips amount for the order",
      optional: true,
    },
    tax: {
      type: "string",
      label: "Tax",
      description: "The tax for the order",
      optional: true,
    },
    discountAmount: {
      type: "string",
      label: "Discount Amount",
      description: "The discount amount for the order",
      optional: true,
    },
    deliveryFee: {
      type: "string",
      label: "Delivery Fee",
      description: "The delivery fee for the order",
      optional: true,
    },
    totalOrderCost: {
      type: "string",
      label: "Total Order Cost",
      description: "The total cost of the order",
      optional: true,
    },
    pickupInstruction: {
      type: "string",
      label: "Pickup Instruction",
      description: "The pickup instructions for the order",
      optional: true,
    },
    deliveryInstruction: {
      type: "string",
      label: "Delivery Instruction",
      description: "The delivery instructions for the order",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.shipday.com";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Basic ${this._apiKey()}`,
        },
      });
    },
    createShippingOrder(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/orders",
      });
    },
  },
};
