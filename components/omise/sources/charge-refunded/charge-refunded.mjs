import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "omise-charge-refunded",
  name: "New Charge Refunded",
  description: "Emit new event for each refunded charge through the OPN platform.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilter() {
      return "refunded_amount";
    },
    getSummary(item) {
      return `Charge ${item.id} refunded`;
    },
  },
  sampleEmit,
};
