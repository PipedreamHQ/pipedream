import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "Customer Updated",
  key: "dear-customer-updated",
  type: "source",
  description: "Emit new event when a customer is updated.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.CUSTOMER_UPDATED;
    },
    getMetadata(payload) {
      const {
        amznTraceId,
        ...summary
      } = payload;

      const compositeId = `${payload.CustomerDetailsList[0].Customer.ID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: JSON.stringify(summary),
        ts: Date.now(),
      };
    },
  },
};
