import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Sale Partial Payment Received",
  key: "dear-new-sale-partial-payment-received",
  type: "source",
  description: "Emit new event when a sale partial payment is received",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_PARTIAL_PAYMENT_RECEIVED;
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
        summary: `A new sale partial payment with DocumentNumber: ${DocumentNumber} was successfully received!`,
        ts: Date.now(),
      };
    },
  },
};
