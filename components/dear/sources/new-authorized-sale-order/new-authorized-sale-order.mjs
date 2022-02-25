import constants from "../../common/constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  name: "New Authorized Sale Order",
  key: "dear-new-authorized-sale-order",
  type: "source",
  description: "Emit new event when a sale order is created and authorized",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_ORDER_AUTHORISED;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        ...summary
      } = payload;

      const compositeId = `${payload.SaleID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: JSON.stringify(summary),
        ts: Date.now(),
      };
    },
  },
};
