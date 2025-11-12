import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Sale Undo",
  key: "dear-new-sale-undo",
  type: "source",
  description: "Emit new event when a sale is undone",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_UNDO;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        SaleID,
        SaleOrderNumber,
      } = payload;

      const compositeId = `${SaleID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: `A new sale with OrderNumber: ${SaleOrderNumber} was successfully undone!`,
        ts: Date.now(),
      };
    },
  },
};
