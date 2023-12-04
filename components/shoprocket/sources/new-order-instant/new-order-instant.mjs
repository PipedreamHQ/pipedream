import common from "../common/base.mjs";

export default {
  ...common,
  key: "shoprocket-new-order-instant",
  name: "New Order (Instant)",
  description: "Emit new event when a new order is placed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubject() {
      return "order";
    },
  },
};
