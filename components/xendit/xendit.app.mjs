import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "xendit",
  propDefinitions: {
    paymentRequestId: {
      type: "string",
      label: "Payment Request Id",
      description: "The ID of the payment request you want to get the status for.",
      async options({ prevContext }) {
        const { data } = await this.listPaymentRequests({
          params: {
            limit: LIMIT,
            after_id: prevContext?.afterId,
          },
        });

        return {
          options: data.map(({ id }) => id),
          context: {
            afterId: data[data?.length - 1]?.id,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.xendit.co";
    },
    _getAuth() {
      return {
        "username": `${this.$auth.secret_key}`,
        "password": "",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        auth: this._getAuth(),
        ...opts,
      });
    },
    listInvoices(args = {}) {
      return this._makeRequest({
        path: "v2/invoices",
        ...args,
      });
    },
    listPaymentRequests(args = {}) {
      return this._makeRequest({
        path: "payment_requests",
        ...args,
      });
    },
    getPaymentRequest({
      paymentRequestId, ...args
    }) {
      return this._makeRequest({
        path: `payment_requests/${paymentRequestId}`,
        ...args,
      });
    },
    createInvoice(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "v2/invoices",
        ...args,
      });
    },
    createPayout(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "v2/payouts",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, cursor, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;

      do {
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        if (data.length) params[cursor] = data[data.length - 1].id;

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
