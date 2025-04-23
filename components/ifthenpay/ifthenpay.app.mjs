import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ifthenpay",
  propDefinitions: {
    requestId: {
      type: "string",
      label: "Request ID",
      description: "Token associated with the payment request transaction",
      async options({ prevContext }) {
        const { payments } = await this.listPayments({
          data: {
            dateStart: prevContext.token,
          },
        });

        return {
          options: payments.map(({
            requestId: value, orderId: label,
          }) => ({
            label,
            value,
          })),
          context: {
            token: payments[0].paymentDate,
          },
        };
      },
    },
    mbWayKey: {
      type: "string",
      label: "Mb Way Key",
      description: "The key for the MB Way payment method.",
      secret: true,
    },
    mbKey: {
      type: "string",
      label: "Mb Key",
      description: "The key for the Multibanco payment method.",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ifthenpay.com";
    },
    _data(data) {
      return {
        "boKey": `${this.$auth.backoffice_key}`,
        ...data,
      };
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          "accept": "application/json",
        },
        data: this._data(data),
        ...opts,
      });
    },
    generatePaymentReference({
      paymentMethod, data, ...opts
    }) {
      let path;
      if (paymentMethod === "Multibanco") {
        path = "/multibanco/reference/init";
        data.mbKey = this.$auth.mb_key;
      } else if (paymentMethod === "MB WAY") {
        path = "/spg/payment/mbway";
        data.mbWayKey = this.$auth.mbWayKey;
      }

      return this._makeRequest({
        method: "POST",
        path,
        data,
        ...opts,
      });
    },
    refundPayment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/endpoint/payments/refund",
        ...opts,
      });
    },
    listPayments(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v2/payments/read",
        ...opts,
      });
    },
  },
};
