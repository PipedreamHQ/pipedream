import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orderspace-customer-updated",
  name: "Customer Updated (Instant)",
  description: "Emit new event when a customer is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "customer.updated",
      ];
    },
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: `${data.customer.id}-${ts}`,
        summary: `Customer ${data.customer.id} updated`,
        ts,
      };
    },
  },
  sampleEmit,
};
