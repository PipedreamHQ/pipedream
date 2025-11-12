import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Authorized Sale Order",
  key: "dear-new-authorized-sale-order",
  type: "source",
  description: "Emit new event when a sale order is created and authorized",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_ORDER_AUTHORISED;
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
        summary: `A new sale order with OrderNumber: ${SaleOrderNumber} was successfully authorized!`,
        ts: Date.now(),
      };
    },
  },
};
