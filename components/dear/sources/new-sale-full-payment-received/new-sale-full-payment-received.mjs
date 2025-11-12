import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Sale Full Payment Received",
  key: "dear-new-sale-full-payment-received",
  type: "source",
  description: "Emit new event when a sale full payment is received",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_FULL_PAYMENT_RECEIVED;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        SaleID,
        DocumentNumber,
      } = payload;

      const compositeId = `${SaleID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: `A new sale full payment with DocumentNumber: ${DocumentNumber} was successfully received!`,
        ts: Date.now(),
      };
    },
  },
};
