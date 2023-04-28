import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Supplier Updated",
  key: "dear-new-supplier-updated",
  type: "source",
  description: "Emit new event when a supplier is updated",
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
        SupplierDetailsList: [
          { ID },
        ],
      } = payload;

      const compositeId = `${ID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: `A supplier with Id: ${ID} was successfully updated!`,
        ts: Date.now(),
      };
    },
  },
};
