import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "orderspace-inventory-level-updated",
  name: "Inventory Level Updated (Instant)",
  description: "Emit new event when an inventory level is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "inventory_level.updated",
      ];
    },
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: `${data.inventory_level.sku}-${ts}`,
        summary: `Inventory level ${data.inventory_level.sku} updated`,
        ts,
      };
    },
  },
  sampleEmit,
};
