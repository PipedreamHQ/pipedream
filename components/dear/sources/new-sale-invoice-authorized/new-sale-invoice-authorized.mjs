import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Sale Invoice Authorized",
  key: "dear-new-sale-invoice-authorized",
  type: "source",
  description: "Emit new event when a sale invoice is authorized",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_INVOICE_AUTHORISED;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        SaleTaskID,
        SaleOrderNumber,
      } = payload;

      const compositeId = `${SaleTaskID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: `A new sale invoice with OrderNumber: ${SaleOrderNumber} was successfully authorized!`,
        ts: Date.now(),
      };
    },
  },
};
