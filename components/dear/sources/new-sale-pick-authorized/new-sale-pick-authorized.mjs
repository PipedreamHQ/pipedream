import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Sale Pick Authorized",
  key: "dear-new-sale-pick-authorized",
  type: "source",
  description: "Emit new event when a sale pick is authorized",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SALE_PICK_AUTHORISED;
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
        summary: `A new sale pick with OrderNumber: ${SaleOrderNumber} was successfully authorized!`,
        ts: Date.now(),
      };
    },
  },
};
