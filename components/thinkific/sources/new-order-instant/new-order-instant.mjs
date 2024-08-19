import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "thinkific-new-order-instant",
  name: "New Order (Instant)",
  version: "0.0.2",
  description: "Emit new event when a new purchase has been made.)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "order.created";
    },
    getSummary(event) {
      return `New Order Created: ${event.payload.id}`;
    },
  },
  sampleEmit,
};
