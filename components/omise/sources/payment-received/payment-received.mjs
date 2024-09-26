import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "omise-payment-received",
  name: "New Payment Received",
  description: "Emit new event for each payment received through the OPN platform.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilter() {
      return "paid_at";
    },
    getSummary(item) {
      return `Payment Received: ${item.amount} ${item.currency}`;
    },
  },
  sampleEmit,
};
