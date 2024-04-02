import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "paigo-new-customer-instant",
  name: "New Customer (Instant)",
  description: "Emit new event when a customer account is created. [See the documentation](http://www.api.docs.paigo.tech/#tag/Webhooks/operation/Subscribe%20a%20Webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookType() {
      return "CUSTOMER_CREATED";
    },
    generateMeta(customer) {
      return {
        id: customer.customerId,
        summary: `New Customer ${customer.customerName}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
