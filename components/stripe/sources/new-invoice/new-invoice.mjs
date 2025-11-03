import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-invoice",
  name: "New Invoice",
  type: "source",
  version: "0.1.4",
  description: "Emit new event for each new invoice",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "invoice.created",
      ];
    },
  },
};
