import common from "../common/common.mjs";

export default {
  ...common,
  key: "loyverse-receipt-updated-instant",
  name: "Receipt Updated (Instant)",
  description: "Emit new event when a receipt is updated.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "receipts.update";
    },
  },
};
