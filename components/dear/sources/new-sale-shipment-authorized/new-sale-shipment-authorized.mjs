import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Sale Shipment Authorized",
  key: "dear-new-sale-shipment-authorized",
  type: "source",
  description: "Emit new event when a sale shipment is authorized",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_SHIPMENT_AUTHORISED;
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
        summary: `A new sale shipment with OrderNumber: ${SaleOrderNumber} was successfully authorized!`,
        ts: Date.now(),
      };
    },
  },
};
