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
    expecteddeliverydate: {
      type: "string",
      label: "Expected Delivery Date",
      description: "Expected delivery date in UTC for the particular order ( yyyy-mm-dd format)",
      optional: true,
    },
    expectedpickuptime: {
      type: "string",
      label: "Expected Pickup Time",
      description: "Expected pickup time in UTC for the particular order (format hh:mm:ss)",
      optional: true,
    },
    expecteddeliverytime: {
      type: "string",
      label: "Expected Delivery Time",
      description: "Expected Delivery Time in UTC for the particular order (format hh:mm:ss)",
      optional: true,
    },
    pickuplatitude: {
      type: "string",
      label: "Pickup Latitude",
      description: "The latitude of the pickup location",
      optional: true,
    },
    pickuplongitude: {
      type: "string",
      label: "Pickup Longitude",
      description: "The longitude of the pickup location",
      optional: true,
    },
    deliverylatitude: {
      type: "string",
      label: "Delivery Latitude",
      description: "The latitude of the delivery location",
      optional: true,
    },
    deliverylongitude: {
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
    discountamount: {
      type: "string",
      label: "Discount Amount",
      description: "The discount amount for the order",
      optional: true,
    },
    deliveryfee: {
      type: "string",
      label: "Delivery Fee",
      description: "The delivery fee for the order",
      optional: true,
    },
    totalordercost: {
      type: "string",
      label: "Total Order Cost",
      description: "The total cost of the order",
      optional: true,
    },
    pickupinstruction: {
      type: "string",
      label: "Pickup Instruction",
      description: "The pickup instructions for the order",
      optional: true,
    },
    deliveryinstruction: {
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
