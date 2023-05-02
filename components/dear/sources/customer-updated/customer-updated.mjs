import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";
import { v4 as uuid } from "uuid";

export default {
  ...base,
  name: "New Customer Updated",
  key: "dear-customer-updated",
  type: "source",
  description: "Emit new event when a customer is updated.",
  version: "0.0.1",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.CUSTOMER_UPDATED;
    },
    getMetadata(payload) {
      return {
        id: uuid(),
        summary: payload.CustomerDetailsList.map((customer) => customer.Name).join(", "),
        ts: Date.now(),
      };
    },
  },
};
