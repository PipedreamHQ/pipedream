import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-customer-updated",
  name: "Customer Updated",
  description: "Emit new event when a customer is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "customer.customer_updated";
    },
    getSummary({ payload }) {
      return `Customer Updated ID ${payload.customer.id}`;
    },
  },
  sampleEmit,
};
