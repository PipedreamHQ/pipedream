import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-customer-updated",
  name: "Customer Updated (Instant)",
  description: "Emit new event when an customer is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "customers";
    },
    getItemAction() {
      return "updated";
    },
    generateMeta(body) {
      return {
        id: body.customer.id,
        summary: this.getSummary(`Customer with ID ${body.customer.id} updated`),
        ts: Date.parse(body.customer.updatedAt),
      };
    },
  },
  sampleEmit,
};
