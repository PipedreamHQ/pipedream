import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-new-order-instant",
  name: "New Order (Instant)",
  description: "Emit new event when a new order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "order_created",
      ];
    },
    getSummary({ id }) {
      return `New order with ID: ${id}`;
    },
  },
  sampleEmit,
};
