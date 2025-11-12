import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Authorized Purchase Order",
  key: "dear-new-authorized-purchase-order",
  type: "source",
  description: "Emit new event when a purchase order is created and authorized",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.PURCHASE_ORDER_AUTHORISED;
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
        summary: `A new purchase order with OrderNumber: ${PurchaseOrderNumber} was successfully authorized!`,
        ts: Date.now(),
      };
    },
  },
};
