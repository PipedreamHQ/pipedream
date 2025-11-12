import { v4 as uuid } from "uuid";
import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Shipment Tracking Number Change",
  key: "dear-sale-shipment-tracking-number-change",
  type: "source",
  description: "Emit new event when a shipment tracking number changes. [See the documentation](https://dearinventory.docs.apiary.io/#reference/webhooks)",
  version: "0.0.3",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_SHIPMENT_TRACKING_NUMBER_CHANGED;
    },
    getMetadata(payload) {
      return {
        id: uuid(),
        summary: `${payload.CustomerName} (${payload.SaleOrderNumber})`,
        ts: Date.now(),
      };
    },
  },
};
