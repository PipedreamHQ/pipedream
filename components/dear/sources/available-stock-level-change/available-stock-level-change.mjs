import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";
import { v4 as uuid } from "uuid";

export default {
  ...base,
  name: "New Available Stock Level Change",
  key: "dear-available-stock-level-change",
  type: "source",
  description: "Emit new event when the available stock level changes. [See the documentation](https://dearinventory.docs.apiary.io/#reference/webhooks)",
  version: "0.0.1",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.STOCK_AVAILABLE_STOCK_LEVEL_CHANGE;
    },
    getMetadata(payload) {
      const id = uuid();
      const item0 = payload[0];
      return {
        id: id,
        summary: item0
          ? `${item0.Name} (${item0.SKU})`
          : `No product code (internal uuid:${id})`,
        ts: Date.now(),
      };
    },
  },
};
