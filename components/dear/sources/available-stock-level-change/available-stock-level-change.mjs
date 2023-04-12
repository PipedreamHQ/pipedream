import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "Available Stock Level Change",
  key: "dear-available-stock-level-change",
  type: "source",
  description: "Emit a new event when the available stock level changes.",
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
        ...summary
      } = payload;

      const compositeId = `${payload[0].ID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: JSON.stringify(summary),
        ts: Date.now(),
      };
    },
  },
};
