import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bloomerang-new-donation",
  name: "New Donation",
  description: "Emit new event when a donation is received in Bloomerang.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listTransactions;
    },
    getSummary(item) {
      return `New Donation from ${item.AccountId}`;
    },
  },
  sampleEmit,
};
