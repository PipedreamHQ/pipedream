import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Sale Pack Authorized",
  key: "dear-new-sale-pack-authorized",
  type: "source",
  description: "Emit new event when a sale pack is authorized",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_PACK_AUTHORISED;
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
        summary: `A new sale pack with OrderNumber: ${SaleOrderNumber} was successfully authorized!`,
        ts: Date.now(),
      };
    },
  },
};
