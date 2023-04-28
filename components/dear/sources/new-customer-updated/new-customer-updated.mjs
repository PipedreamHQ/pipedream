import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Customer Updated",
  key: "dear-new-customer-updated",
  type: "source",
  description: "Emit new event when a customer is updated",
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
        CustomerDetailsList: [
          { ID },
        ],
      } = payload;

      const compositeId = `${ID}-${amznTraceId}`;

      return {
        id: compositeId,
        summary: `A customer with Id: ${ID} was successfully updated!`,
        ts: Date.now(),
      };
    },
  },
};
