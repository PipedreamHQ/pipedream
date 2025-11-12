import { v4 as uuid } from "uuid";
import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Available Stock Level Change",
  key: "dear-available-stock-level-change",
  type: "source",
  description: "Emit new event when the available stock level changes. [See the documentation](https://dearinventory.docs.apiary.io/#reference/webhooks)",
  version: "0.0.3",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.STOCK_AVAILABLE_STOCK_LEVEL_CHANGE;
    },
    getMetadata(payload = []) {
      return {
        id: uuid(),
        summary: `${payload[0]?.Name} (${payload[0]?.SKU})`,
        ts: Date.now(),
      };
    },
  },
};
