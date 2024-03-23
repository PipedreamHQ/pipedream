import common from "../common/common.mjs";

export default {
  ...common,
  key: "loyverse-item-updated-instant",
  name: "Item Updated (Instant)",
  description: "Emit new event when an item is updated.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookType() {
      return "items.update";
    },
  },
};
