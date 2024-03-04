import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paystack",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer to charge",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount to charge",
    },
    currency: {
      type: "string",
      label: "Currency",
      description:
        "Currency to use for the charge. Defaults to your integration currency",
    },
    reference: {
      type: "string",
      label: "Reference",
      description:
        "Unique transaction reference. Only alphanumeric characters and `-`, `.`, `=` are allowed",
    },
    callback_url: {
      type: "string",
      label: "Callback URL",
      description:
        "URL to redirect customers to after a successful transaction. Setting this overrides the callback URL set on the dashboard",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description:
        "Stringified JSON object of custom data. Check the [Metadata docs](https://paystack.com/docs/payments/metadata/) for more information",
    },
    status: {
      type: "string",
      label: "Status",
      description:
        "Status of a transaction. Possible values are success, failed, and abandoned.",
    },
    transactionID: {
      type: "integer",
      label: "Transaction ID",
      description: "Unique numerical ID for a transaction on your integration"
    },
    customerID: {
      type: "integer",
      label: "Customer ID",
      description: "Unique ID for a customer on your integration.",
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Specify the number of data records to return per page",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Specify the page of data records to return",
    },
    from: {
      type: "string",
      label: "From",
      description:
        "The start date for record retrieval, in ISO 8601 format (e.g., 2016-09-24T00:00:05.000Z or 2016-09-21).",
    },
    to: {
      type: "string",
      label: "To",
      description:
        "The end date for record retrieval, in ISO 8601 format (e.g., 2016-09-24T00:00:05.000Z or 2016-09-21).",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.paystack.co";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "user-agent": "@PaystackOSS/paystack v0.1",
      };
    },
    _makeRequest({ $ = this, path = "/", ...opts }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    initializeTransaction(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transaction/initialize",
        ...args,
      });
    },
    verifyTransaction({ reference }) {
      return this._makeRequest({
        method: "GET",
        path: `/transaction/verify/${reference}`,
      });
    },
    listTransactions({ params = {} }) {
      return this._makeRequest({
        method: "GET",
        path: `/transaction`,
        params,
      });
    },
    fetchTransaction({ transactionID }) {
      return this._makeRequest({
        method: "GET",
        path: `/transaction/${transactionID}`
      })
    },
  },
};
