import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Purchase Invoice Authorized",
  key: "dear-new-purchase-invoice-authorized",
  type: "source",
  description: "Emit new event when a purchase invoiced is authorized",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.PURCHASE_INVOICE_AUTHORISED;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        TaskID,
        InvoiceNumber,
      } = payload;

      const compositeId = `${TaskID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: `A new purchase invoice with InvoiceNumber: ${InvoiceNumber} was successfully authorized!`,
        ts: Date.now(),
      };
    },
  },
};
