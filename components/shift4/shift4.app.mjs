import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shift4",
  propDefinitions: {
    orderIdentifier: {
      type: "string",
      label: "Order Identifier",
      description: "The identifier of the order related to the charge that was updated.",
      required: true,
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The charge amount in minor units of a given currency. For example, 10€ is represented as '1000'.",
      required: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The charge currency represented as a three-letter ISO currency code.",
      required: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "The interval at which a plan is set to recur. Could be 'day', 'week', 'month', or 'year'.",
      required: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the plan.",
      required: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer.",
      required: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the charge.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the charge.",
      optional: true,
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Identifier of the customer that will be associated with this charge.",
      optional: true,
    },
    card: {
      type: "string",
      label: "Card",
      description: "Card token, card details or card identifier.",
      optional: true,
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Payment method details or identifier.",
      optional: true,
    },
    flow: {
      type: "object",
      label: "Flow",
      description: "Details specific to the payment method charge.",
      optional: true,
    },
    captured: {
      type: "boolean",
      label: "Captured",
      description: "Whether this charge should be immediately captured.",
      optional: true,
    },
    shipping: {
      type: "object",
      label: "Shipping",
      description: "Shipping details.",
      optional: true,
    },
    billing: {
      type: "object",
      label: "Billing",
      description: "Billing details.",
      optional: true,
    },
    threeDSecure: {
      type: "object",
      label: "3D Secure",
      description: "3D Secure options.",
      optional: true,
    },
    merchantAccountId: {
      type: "string",
      label: "Merchant Account ID",
      description: "Identifier of the merchant account that will be used to create this charge.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata object.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.shift4.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createCharge({
      amount, currency, type, description, customerId, card, paymentMethod, flow, captured, shipping, billing, threeDSecure, merchantAccountId, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/charges",
        data: {
          amount,
          currency,
          type,
          description,
          customerId,
          card,
          paymentMethod,
          flow,
          captured,
          shipping,
          billing,
          threeDSecure,
          merchantAccountId,
          metadata,
        },
      });
    },
    async createPlan({
      amount, currency, interval, name, intervalCount, billingCycles, trialPeriodDays, recursTo, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/plans",
        data: {
          amount,
          currency,
          interval,
          name,
          intervalCount,
          billingCycles,
          trialPeriodDays,
          recursTo,
          metadata,
        },
      });
    },
    async createCustomer({
      email, description, card, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: {
          email,
          description,
          card,
          metadata,
        },
      });
    },
  },
};
