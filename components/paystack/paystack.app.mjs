import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
      description: "Currency to use for the charge. Defaults to your integration currency",
      options: constants.CURRENCIES,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Unique transaction reference. Only alphanumeric characters and `-`, `.`, `=` are allowed",
      async options({ page }) {
        const { data } = await this.listTransactions({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({ reference }) => ({
          value: reference,
          label: `${reference}`,
        })) || [];
      },
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "URL to redirect customers to after a successful transaction. Setting this overrides the callback URL set on the dashboard",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Stringified JSON object of custom data. Check the [Metadata docs](https://paystack.com/docs/payments/metadata/) for more information",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of a transaction. Possible values are success, failed, and abandoned.",
      options: constants.STATUS,
    },
    transactionID: {
      type: "integer",
      label: "Transaction ID",
      description: "Unique numerical ID for a transaction on your integration",
      async options({ page }) {
        const { data } = await this.listTransactions({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({ id }) => ({
          value: id,
          label: `${id}`,
        })) || [];
      },
    },
    customerID: {
      type: "integer",
      label: "Customer ID",
      description: "Unique ID for a customer on your integration.",
      async options({ page }) {
        const { data } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        }); console.log(data);
        return data?.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    from: {
      type: "string",
      label: "From",
      description: "The start date for record retrieval, in ISO 8601 format (e.g., 2016-09-24T00:00:05.000Z or 2016-09-21).",
    },
    to: {
      type: "string",
      label: "To",
      description: "The end date for record retrieval, in ISO 8601 format (e.g., 2016-09-24T00:00:05.000Z or 2016-09-21).",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.paystack.co";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "user-agent": "@PaystackOSS/paystack v0.1",
      };
    },
    _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
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
    verifyTransaction({
      reference, ...args
    }) {
      return this._makeRequest({
        path: `/transaction/verify/${reference}`,
        ...args,
      });
    },
    listTransactions(args = {}) {
      return this._makeRequest({
        path: "/transaction",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "/customer",
        ...args,
      });
    },
    fetchTransaction({
      transactionID, ...args
    }) {
      return this._makeRequest({
        path: `/transaction/${transactionID}`,
        ...args,
      });
    },
    async *paginate({
      resourceFn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          perPage: constants.DEFAULT_LIMIT,
          page: 1,
        },
      };
      let total, count = 0;
      do {
        const { data } = await resourceFn(args);
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        total = data?.length;
      } while (total === args.params.perPage);
    },
  },
};
