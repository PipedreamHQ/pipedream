import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Purchase Stock Received Authorized",
  key: "dear-new-purchase-stock-received-authorized",
  type: "source",
  description: "Emit new event when a purchase stock received is authorized",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.PURCHASE_STOCK_RECEIVED_AUTHORISED;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        TaskID,
        PurchaseOrderNumber,
      } = payload;

      const compositeId = `${TaskID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: `A new purchase stock received with OrderNumber: ${PurchaseOrderNumber} was successfully authorized!`,
        ts: Date.now(),
      };
    },
  },
};
