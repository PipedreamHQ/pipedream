import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Sale Voided",
  key: "dear-new-sale-voided",
  type: "source",
  description: "Emit new event when a sale is voided",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_VOIDED;
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
        summary: `A new sale with OrderNumber: ${SaleOrderNumber} was successfully voided!`,
        ts: Date.now(),
      };
    },
  },
};
