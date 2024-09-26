import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "loyverse-item-updated-instant",
  name: "Item Updated (Instant)",
  description: "Emit new event when an item is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  methods: {
    ...common.methods,
    getSummary(body) {
      const { length } = body.items;
      return `${length} item${length === 1
        ? ""
        : "s"} updated`;
    },
    getHookType() {
      return "items.update";
    },
  },
};
