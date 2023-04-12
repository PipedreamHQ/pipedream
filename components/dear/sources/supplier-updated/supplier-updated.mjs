import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "Supplier Updated",
  key: "dear-supplier-updated",
  type: "source",
  description: "Emit new event when a supplier is updated.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SUPPLIER_UPDATED;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        ...summary
      } = payload;

      const compositeId = `${payload.SupplierDetailsList[0].Supplier.ID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: JSON.stringify(summary),
        ts: Date.now(),
      };
    },
  },
};
