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
    getSummary(body) {
      const { length } = body.receipts;
      return `${length} receipt${length === 1
        ? ""
        : "s"} updated`;
    },
    getHookType() {
      return "receipts.update";
    },
  },
};
