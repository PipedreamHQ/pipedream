import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Purchase Credit Note Authorized",
  key: "dear-new-purchase-credit-note-authorized",
  type: "source",
  description: "Emit new event when a purchase credit note is authorized",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.PURCHASE_CREDIT_NOTE_AUTHORISED;
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
        summary: `A new purchase credit note with OrderNumber: ${PurchaseOrderNumber} was successfully authorized!`,
        ts: Date.now(),
      };
    },
  },
};
