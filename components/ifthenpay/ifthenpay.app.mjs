import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ifthenpay",
  propDefinitions: {
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The payment method to use for Ifthenpay (e.g., MB WAY, Multibanco)",
      options: [
        "MB WAY",
        "Multibanco",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount to be paid",
    },
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "Details of the customer",
      properties: {
        clientCode: {
          type: "string",
          label: "Client Code",
          description: "The client's code",
        },
        clientName: {
          type: "string",
          label: "Client Name",
          description: "The name of the client",
        },
        clientEmail: {
          type: "string",
          label: "Client Email",
          description: "The email address of the client",
        },
        clientUsername: {
          type: "string",
          label: "Client Username",
          description: "The username of the client",
        },
        clientPhone: {
          type: "string",
          label: "Client Phone",
          description: "The phone number of the client",
        },
        mobileNumber: {
          type: "string",
          label: "Mobile Number",
          description: "The mobile phone number of the client",
        },
      },
      required: [
        "clientCode",
        "clientName",
        "clientEmail",
      ],
    },
    expirationDate: {
      type: "string",
      label: "Expiration Date",
      description: "Expiration date of the payment reference",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the payment",
      optional: true,
    },
    originalPaymentId: {
      type: "string",
      label: "Original Payment ID",
      description: "The ID of the original payment to refund",
    },
    refundAmount: {
      type: "string",
      label: "Refund Amount",
      description: "The amount to refund",
    },
    reasonForRefund: {
      type: "string",
      label: "Reason for Refund",
      description: "The reason for the refund",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ifthenpay.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async generatePaymentReference({
      paymentMethod,
      amount,
      customerDetails,
      expirationDate,
      description,
    }) {
      let path;
      const data = {
        orderId: new Date().getTime()
          .toString(), // Unique order ID
        amount,
        description,
        ...customerDetails,
      };

      if (paymentMethod === "Multibanco") {
        path = "/multibanco/reference/init";
        if (expirationDate !== undefined) {
          data.expiryDays = expirationDate;
        }
        data.mbKey = this.$auth.mbKey;
      } else if (paymentMethod === "MB WAY") {
        path = "/spg/payment/mbway";
        data.mbWayKey = this.$auth.mbWayKey;
        data.mobileNumber = customerDetails.mobileNumber;
        data.email = customerDetails.clientEmail;
      }

      return this._makeRequest({
        method: "POST",
        path,
        data,
      });
    },
    async refundPayment({
      originalPaymentId,
      refundAmount,
      reasonForRefund,
    }) {
      const data = {
        backofficekey: this.$auth.backofficeKey,
        requestId: originalPaymentId,
        amount: refundAmount,
      };

      if (reasonForRefund !== undefined) {
        data.reason = reasonForRefund;
      }

      return this._makeRequest({
        method: "POST",
        path: "/endpoint/payments/refund",
        data,
      });
    },
    async emitPaymentCompletedEvent(paymentDetails) {
      const data = {
        paymentDetails,
        event: "payment_completed",
      };

      return this._makeRequest({
        method: "POST",
        path: "/events",
        data,
      });
    },
  },
};
