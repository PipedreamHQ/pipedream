import { axios } from "@pipedream/platform";
import { EVENT_TYPES } from "./common/constants.mjs";

export default {
  type: "app",
  app: "cometly",
  propDefinitions: {
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The event type.",
      options: EVENT_TYPES,
    },
    eventTime: {
      type: "string",
      label: "Event Time",
      description: "Timestamp in UTC timezone. You can use an ISO 8601 formatted string, or a Unix timestamp in milliseconds.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email associated with the event",
    },
    ip: {
      type: "string",
      label: "IP",
      description: "IP address associated with the event",
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Full name of the user",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the user",
      optional: true,
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "User agent of the user's device",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone numbers must include a country code to be used for matching (e.g., the number 1 must precede a phone number in the United States). Always include the country code as part of your customers' phone numbers, even if all of your data is from the same country.",
      optional: true,
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "Order ID for the event",
      optional: true,
    },
    orderName: {
      type: "string",
      label: "Order Name",
      description: "Order name for the event",
      optional: true,
    },
    checkoutToken: {
      type: "string",
      label: "Checkout Token",
      description: "Checkout token for the event",
      optional: true,
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "Amount for the event",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.cometly.com/public-api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    },
    async sendEvent(opts = {}) {
      return this._makeRequest({
        path: "/events",
        method: "POST",
        ...opts,
      });
    },
  },
};
