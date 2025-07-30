import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orderspace-new-customer-created",
  name: "New Customer Created (Instant)",
  description: "Emit new event when a customer is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "customer.created",
      ];
    },
    generateMeta(data) {
      return {
        id: data.customer.id,
        summary: `Customer ${data.customer.id} created`,
        ts: Date.parse(data.customer.created_at),
      };
    },
  },
  sampleEmit,
};
