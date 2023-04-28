import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Available Stock Level Changed",
  key: "dear-new-available-stock-level-changed",
  type: "source",
  description: "Emit new event when a available stock level is changed",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.STOCK_AVAILABLE_STOCK_LEVEL_CHANGE;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        ...logs
      } = payload;

      const compositeId = `${logs["0"].ID} - ${amznTraceId} `;

      return {
        id: compositeId,
        summary: `An available stock level of item with SKU: ${logs["0"].SKU} was successfully changed!`,
        ts: Date.now(),
      };
    },
  },
};
