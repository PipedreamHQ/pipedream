import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shipday",
  propDefinitions: {
    expecteddeliverydate: {
      type: "string",
      label: "Expected Delivery Date",
      description: "The expected delivery date for the order",
      optional: true,
    },
    expectedpickuptime: {
      type: "string",
      label: "Expected Pickup Time",
      description: "The expected pickup time for the order",
      optional: true,
    },
    expecteddeliverytime: {
      type: "string",
      label: "Expected Delivery Time",
      description: "The expected delivery time for the order",
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
      description: "The tips for the order",
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
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createShippingOrder(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/orders",
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
