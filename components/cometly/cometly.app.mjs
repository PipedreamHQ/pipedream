import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cometly",
  propDefinitions: {
    eventName: {
      type: "string",
      label: "Event Name",
      description: "One of the following events: lead_generated, view_content, schedule, purchase, subscribe, add_to_cart, contact, initiate_checkout, add_payment_info, complete_registration, start_trial, sign_up, submit_application, webinar_registration",
      options: [
        "lead_generated",
        "view_content",
        "schedule",
        "purchase",
        "subscribe",
        "add_to_cart",
        "contact",
        "initiate_checkout",
        "add_payment_info",
        "complete_registration",
        "start_trial",
        "sign_up",
        "submit_application",
        "webinar_registration",
      ],
    },
    eventTime: {
      type: "integer",
      label: "Event Time",
      description: "Timestamp in UTC timezone",
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
      description: "Phone number of the user",
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
