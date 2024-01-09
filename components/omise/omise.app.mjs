import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "opn_platform",
  version: "0.0.{{ts}}",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for a customer",
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount for the charge in the smallest currency unit",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency for the charge",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the customer or charge",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address for the customer",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Custom metadata for the customer or charge",
      optional: true,
    },
    cardToken: {
      type: "string",
      label: "Card Token",
      description: "An unused token identifier to add as a new card to the customer",
      optional: true,
    },
    defaultCard: {
      type: "string",
      label: "Default Card ID",
      description: "Identifier of the default card for creating charges",
      optional: true,
    },
    capture: {
      type: "boolean",
      label: "Capture",
      description: "Whether the charge is set to be automatically captured",
      optional: true,
      default: true,
    },
    returnUri: {
      type: "string",
      label: "Return URI",
      description: "The URI to which the customer is redirected after authorization",
      optional: true,
    },
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "A valid source identifier or source object",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the charge to filter by",
      options: [
        {
          label: "Payment Received",
          value: "successful",
        },
        {
          label: "Refunded Charge",
          value: "refunded",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.opn.ooo";
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
          Authorization: `Bearer ${this.$auth.secret_key}`,
        },
      });
    },
    async createCustomer({
      email, description, cardToken, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: {
          email,
          description,
          card: cardToken,
          metadata,
        },
      });
    },
    async updateCustomer({
      customerId, email, description, cardToken, defaultCard, metadata,
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/customers/${customerId}`,
        data: {
          email,
          description,
          card: cardToken,
          default_card: defaultCard,
          metadata,
        },
      });
    },
    async createCharge({
      amount, currency, customerId, cardToken, description, metadata, capture, returnUri, sourceId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/charges",
        data: {
          amount,
          currency,
          customer: customerId,
          card: cardToken,
          description,
          metadata,
          capture,
          return_uri: returnUri,
          source: sourceId,
        },
      });
    },
    async listCharges({ status }) {
      return this._makeRequest({
        path: "/charges",
        params: {
          status,
        },
      });
    },
  },
};
