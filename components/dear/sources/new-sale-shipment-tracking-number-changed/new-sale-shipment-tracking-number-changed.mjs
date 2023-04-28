import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Sale Shipment Tracking Number Change",
  key: "dear-new-sale-shipment-tracking-number-changed",
  type: "source",
  description: "Emit new event when a sale shipment tracking number is changed",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_SHIPMENT_TRACKING_NUMBER_CHANGED;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        SaleTaskID,
        SaleOrderNumber,
      } = payload;

      const compositeId = `${SaleTaskID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: `A new sale shipment tracking number with OrderNumber: ${SaleOrderNumber} was successfully changed!`,
        ts: Date.now(),
      };
    },
  },
};
