import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-new-customer-created",
  name: "New Customer Created (Instant)",
  description: "Emit new event when an customer is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getItemGroup() {
      return "customers";
    },
    getItemAction() {
      return "created";
    },
    generateMeta(body) {
      return {
        id: body.customer.id,
        summary: `Customer with ID ${body.customer.id} created`,
        ts: Date.parse(body.customer.createdAt),
      };
    },
  },
  sampleEmit,
};
